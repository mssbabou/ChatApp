import { useEffect, useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { ArrowUpward, AttachFile, Close } from "@mui/icons-material";

export default function ChatInput({ sendMessage, reciever }) {
  const [messageField, setMessageField] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [canSend, setCanSend] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  const handleMessageFieldChange = (event) => {
    setMessageField(event.target.value);
  };

  const handleFileChange = (event) => {
    if (event.target.files.length === 0 || event.target.files[0] === undefined) return;
    setAttachments([...attachments, event.target.files[0]]);
    console.log(attachments);
  }

  const handleSendMessage = async () => {
    if (canSend) {
      try {
        const sucess = await sendMessage(messageField);
        if (sucess) setMessageField("");
      } catch (error) {
        
      }
    }
  }

  useEffect(() => {
    setCanSend(messageField !== "" || attachments.length > 0);
  }, [messageField, attachments]);

  return (
    <div>
      <div>
        {attachments.map((attachment, index) => (
          <div key={index}>
            <span>{attachment.name}</span>
            <IconButton onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}>
              <Close />
            </IconButton>
          </div>
        ))}
      </div>
      <TextField
      className="mb-2"
      placeholder={`Message ${reciever}`}
      variant="outlined"
      fullWidth
      multiline
      maxRows={5}
      size="medium"
      value={messageField}
      onChange={handleMessageFieldChange}
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
              className={`rounded-md p-1 ${canSend ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-300 hover:bg-gray-300"}`}>
  
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