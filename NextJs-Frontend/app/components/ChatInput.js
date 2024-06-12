"use client";

import { useEffect, useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { ArrowUpward, AttachFile, Close } from "@mui/icons-material";

export default function ChatInput({ sendMessage, uploadFile, receiver }) {
  const [messageField, setMessageField] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [attachmentLinks, setAttachmentLinks] = useState([]);
  const [canSend, setCanSend] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

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
        const success = await sendMessage(newMessage);
        if (success) {
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
    <div
      className={`mx-2 mb-2 rounded-3xl bg-gray-300 border-none border-2 ${isHovered ? 'border-gray-800' : 'border-gray-500'} ${isPressed ? 'border-blue-600' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <div className="flex flex-row overflow-x-auto">
        {attachments.map((attachment, index) => (
          <div key={index} className="ml-2 my-2 pl-2 pt-2">
            <div className="bg-gray-600 p-1 rounded-t-lg flex flex-row justify-end">
              <IconButton
                style={{
                  borderRadius: '0.25rem', // 2px for rounded-sm
                  backgroundColor: '#f56565', // bg-red-500
                  color: '#ffffff', // text-white
                  width: 20,
                  height: 20,
                }}
                onClick={() => removeAttachment(index)}
              >
                <Close />
              </IconButton>
            </div>
            <div className="relative" style={{ width: 100, height: 100 }}>
              {attachment.type.startsWith('image/') ? (
                <img src={URL.createObjectURL(attachment)} className="border-2 border-gray-600 rounded-b-lg" alt={attachment.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src="/UnknownFile.png" className="border-2 border-gray-600 rounded-b-lg" alt={attachment.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          </div>
        ))}
      </div>
      <TextField
        placeholder={`Message ${receiver ? receiver : ""}`}
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
        style={{ background: "white", }}
        sx={{
          "& fieldset": {
            border: 2,
            borderColor: "gray",
            borderTopLeftRadius: attachments.length === 0 ? 20 : 0,
            borderTopRightRadius: attachments.length === 0 ? 20 : 0,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          },
        }}
      />
    </div>
  );
}
