"use client";
import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { ArrowUpward, AttachFile } from "@mui/icons-material";

export default function Home() {
  const [message, setMessage] = useState('');

  const handleMessageFieldChange = (event) => {
    setMessage(event.target.value);
  };

  const messages = [
    { id: 1, timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you? First" },
    { id: 2, timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you?" },
    { id: 3, timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you?" },
    { id: 4, timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you?" },
    { id: 5, timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you?" },
    { id: 6, timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you?" },
    { id: 7, timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you?" },
    { id: 8, timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you?" },
    { id: 9, timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you?" },
    { id: 10, timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you? last" },
  ]

  return (
    <main className="flex max-h-screen flex-col items-center justify-between">
      <div className="flex-1 mt-3 mb-3 rounded-xl border-gray border-2 overflow-auto" style={{width: 600}}>
        {messages.map((message, index) => (
          <div key={index} className="bg-gray-200 m-2 p-3 rounded-xl">
            <div className="flex">
              <h2 className="m-1">{message.username}</h2>
              <span className="m-1">{message.timeStamp}</span>
            </div>
            <div>
              <p className="m-1">{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex" style={{width: 600}}>
        <TextField
          className="mb-3"
          variant="outlined"
          fullWidth
          multiline
          maxRows="5"
          size="3xl"
          value={message}
          onChange={handleMessageFieldChange}
          InputProps={{
            startAdornment: (
              <InputAdornment  position="start">
                <IconButton>
                  <AttachFile />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={message == ''} className="bg-gray-400 rounded-md p-1">
                  <ArrowUpward className="text-white text-xl" />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& fieldset': {
              border: 2,
              borderColor: 'gray-400',
              borderRadius: 3, // Change this to adjust the border radius
            },
          }}
        />
      </div>
    </main>
  );
}