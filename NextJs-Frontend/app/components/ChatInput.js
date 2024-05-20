import { TextField, InputAdornment, IconButton } from "@mui/material";
import { ArrowUpward, AttachFile } from "@mui/icons-material";

export default function ChatInput({ messageField, handleMessageFieldChange, sendMessage, reciever }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
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
          <IconButton>
            <AttachFile />
          </IconButton>
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          <IconButton 
            onClick={sendMessage}
            disableTouchRipple={messageField == ""}  
            className={`rounded-md p-1 ${messageField ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-300 hover:bg-gray-300"}`}>

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
  );
}