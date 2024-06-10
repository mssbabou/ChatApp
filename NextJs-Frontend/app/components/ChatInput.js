"use client";

import { useEffect, useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { ArrowUpward, AttachFile, Close } from "@mui/icons-material";

export default function ChatInput({ sendMessage, uploadFile, receiver }) {
  const [messageField, setMessageField] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [attachmentLinks, setAttachmentLinks] = useState([]);
  const [canSend, setCanSend] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }

  const handleMessageFieldChange = (event) => {
    setMessageField(event.target.value);
  };

  const handleFileChange = async (event) => {
    if (event.target.files.length === 0 || event.target.files[0] === undefined) return;

    handleUploadFile(event.target.files[0]);

    console.log(attachments);
    console.log(attachmentLinks);
  }

  const handleSendMessage = async () => {
    if (canSend) {
      try {
        let newMessage = messageField;
        if (attachments.length > 0) {
          newMessage = `${newMessage}\n${attachmentLinks.join("\n")}`;
        }
        const sucess = await sendMessage(newMessage);
        if (sucess) {
          setMessageField("");
          setAttachments([]);
          setAttachmentLinks([]);
        }
      } catch (error) {
        
      }
    }
  }

  const handleUploadFile = async (file) => {
    const url = await uploadFile(file);
    if (url) {
      setAttachments([...attachments, file]);
      setAttachmentLinks([...attachmentLinks, url]);
    }
  }

  const handlePaste = (event) => {
    console.log(event.clipboardData.items);
    if (event.clipboardData.items) {
      for (let i = 0; i < event.clipboardData.items.length; i++) {
        const item = event.clipboardData.items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            // Check if the file is an image
            if (!file.type.startsWith('image/')) {
              continue;
            }

            handleUploadFile(file);
          }
        }
      }
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
    setAttachmentLinks(attachmentLinks.filter((_, i) => i !== index));
  }

  useEffect(() => {
    setCanSend(messageField !== "" || attachments.length > 0);
  }, [messageField, attachments]);

  const [isSendHovered, setIsSendHovered] = useState(false);
  const sendButtonStyle = {
    borderRadius: '0.375rem', // rounded-md
    padding: '0.25rem', // p-1
    transition: 'background-color 0.3s ease', // smooth transition for hover
    backgroundColor: canSend ? (isSendHovered ? '#1d4ed8' : '#3b82f6') : '#d1d5db',
    cursor: canSend ? 'pointer' : 'default',
  };

  return (
    <div className="p-2">
      <div className="flex flex-row overflow-x-auto gap-2 mb-2">
        {attachments.map((attachment, index) => (
          <div key={index} className="relative border-4 rounded-lg border-gray-600" style={{ width: 100, height: 100 }}>
          {attachment.type.startsWith('image/') ? (
            <img src={URL.createObjectURL(attachment)} className="rounded-sm" alt={attachment.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <img src="/UnknownFile.png" className="rounded-sm" alt={attachment.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <IconButton
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              borderRadius: '0.125rem', // 2px for rounded-sm
              backgroundColor: '#f56565', // bg-red-500
              color: '#ffffff', // text-white
              padding: '0.25rem', // 1rem is 16px, so 0.25rem is 4px for p-1
              width: '1.5rem', // 6 * 0.25rem (1rem is 16px, so 1.5rem is 24px for w-6)
              height: '1.5rem', // 6 * 0.25rem (1rem is 16px, so 1.5rem is 24px for h-6)
            }}
            onClick={() => removeAttachment(index)}
          >
            <Close />
          </IconButton>
        </div>
        ))}
      </div>
      <TextField
        className="mb-2"
        placeholder={`Message ${receiver}`}
        variant="outlined"
        fullWidth
        multiline
        maxRows={5}
        size="medium"
        value={messageField}
        onChange={handleMessageFieldChange}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={(e) => e.currentTarget.querySelector('input').click()}>
                <input type="file" hidden onChange={handleFileChange} />
                <AttachFile />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                onClick={handleSendMessage}
                disableTouchRipple={!canSend}  
                onMouseEnter={() => setIsSendHovered(true)}
                onMouseLeave={() => setIsSendHovered(false)}
                style={sendButtonStyle}
                >
                <ArrowUpward className="text-white" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& fieldset": {
            border: 2,
            borderColor: "gray",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          },
        }}
    />
    </div>
  );
}