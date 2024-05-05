"use client";
import { useState } from "react";
import FlipMove from "react-flip-move";
import { v4 as uuidv4 } from 'uuid';
import InfiniteScroll from "react-infinite-scroll-component";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { ArrowUpward, AttachFile } from "@mui/icons-material";

export default function Home() {
  const [messageField, setMessageField] = useState('');
  const [messages, setMessages] = useState([
    { id: uuidv4(), timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you? First" },
    { id: uuidv4(), timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you? Second" },
    { id: uuidv4(), timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you? Third" },
    { id: uuidv4(), timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you? Fourth" },
    { id: uuidv4(), timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you? Fifth" },
    { id: uuidv4(), timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you? Sixth" },
    { id: uuidv4(), timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you? last" },
  ]);
  const username = "markus";

  const handleMessageFieldChange = (event) => {
    setMessageField(event.target.value);
  };

  // Test function before adding the backend
  function sendMessage(){
    const newMessage = {
      id: uuidv4(),
      timeStamp: new Date().toISOString(), 
      username: username,
      message: messageField,
    };

    //setMessages((prevMessages) => [newMessage, ...prevMessages]);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageField('');
  }

  // Test function before adding the backend
  function fetchMessages(){
    console.log("Fetching messages from the backend...");
    // Fetch messages from the backend
    const newMessages = [
      { id: uuidv4(), timeStamp: "2024-01-01", username: "markus", message: "Hello, how are you? First" },
    ];

    //setMessages((prevMessages) => [...newMessages, ...prevMessages]);
    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
  }

  return (
    <main className="flex flex-col items-center justify-between h-screen">
      <div id="scrollableDiv" className="flex-grow overflow-auto mt-3 mb-3 rounded-xl border-2 border-gray-200 flex flex-col-reverse" style={{ minWidth: 700 }}>
        <InfiniteScroll
            dataLength={messages.length}
            next={fetchMessages}
            inverse={true}
            hasMore={true}
            scrollableTarget="scrollableDiv"
          >
            <FlipMove duration={250}>
              {messages.map((message) => (
                <div key={message.id} className="bg-gray-100 m-2 p-3 rounded-lg shadow" style={{  }}>
                  <div className="flex justify-between">
                    <h2 className="text-base font-semibold text-gray-900">{message.username}</h2>
                    <span className="text-xs text-gray-500">{message.timeStamp}</span>
                  </div>
                  <p className="text-gray-800">{message.message}</p>
                </div>
              ))}
            </FlipMove>
          </InfiniteScroll>
      </div>
      <div className="flex flex-col" style={{ minWidth: 700 }}>
        <h2 className="ml-auto text-base font-semibold text-gray-900 bg-gray-100 px-4 py-1 border-2 border-gray-200 rounded-t-lg">
          {username}
        </h2>
        <TextField
          className="mb-3"
          variant="outlined"
          fullWidth
          multiline
          maxRows={5}
          size="medium"
          value={messageField}
          onChange={handleMessageFieldChange}
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
                <IconButton onClick={sendMessage} disabled={messageField === ""} className={`rounded-md p-1 ${messageField ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-300'}`}>
                  <ArrowUpward className="text-white" />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& fieldset': {
              border: 2,
              borderColor: 'gray',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            },
          }}
        />
      </div>
    </main>
  );
}
