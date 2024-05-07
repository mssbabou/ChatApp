"use client";
import { useState, useEffect, useRef } from 'react';
import FlipMove from 'react-flip-move';
import { v4 as uuidv4 } from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TextField, InputAdornment, IconButton, Skeleton } from '@mui/material';
import { ArrowUpward, AttachFile } from '@mui/icons-material';

export default function Home() {
  const [messageField, setMessageField] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animateNewMessage, setAnimateNewMessage] = useState(true);
  const scrollableDivRef = useRef(null);
  const username = "markus";

  useEffect(() => {
    fetchMessages(false); // Fetch without animation on mount
  }, []);

  const handleMessageFieldChange = (event) => {
    setMessageField(event.target.value);
  };

  function sendMessage() {
    const newMessage = {
      id: uuidv4(),
      timeStamp: new Date().toISOString(),
      username: username,
      message: messageField,
    };
    setAnimateNewMessage(true);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageField('');
  }

  let messageOffset = 0;
  function fetchMessages(animate = false) {
    if (loading) return; // Prevent multiple loads
    setLoading(true);
    setAnimateNewMessage(animate);
    console.log("Fetching messages from the backend...");

    fetch('http://localhost:5001/api/GetMessagesDesc?start=0&count=100')
      .then((response) => response.json())
      .then((data) => {
        messageOffset += data.data.length;
        console.log("Received messages from the backend:", data);
        appendMessages(data.data);
      })
      .catch((error) => {
        console.error("Failed to fetch messages from the backend:", error);
      });
    
    //setMessages((prevMessages) => [...newMessages, ...prevMessages]);

    setLoading(false);
  }

  function appendMessages(data) {
    const newMessages = data.map((message) => ({
      id: message.id,
      timeStamp: message.timeStamp,
      username: message.username,
      message: message.message,
    }));
    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
  }

  return (
    <main className="flex flex-col items-center justify-between h-screen">
      <div ref={scrollableDivRef} id="scrollableDiv" className="flex-grow overflow-auto mt-3 mb-3 rounded-xl border-2 border-gray-200 flex flex-col-reverse" style={{ minWidth: 700 }}>
        <InfiniteScroll
          dataLength={messages.length}
          next={() => fetchMessages(false)}
          inverse={true}
          hasMore={true}
          scrollableTarget="scrollableDiv"
        >
          <FlipMove duration={250} disableAllAnimations={!animateNewMessage}>
            {/*
            {loading && Array(10).fill().map((_, index) => (
              <div key={uuidv4()} className="bg-gray-100 m-2 p-3 rounded-lg shadow" style={{ height: 100 }}>
                <Skeleton variant="text" width={140} height={20} />
                <Skeleton variant="text" width={60} height={20} />
                <Skeleton variant="text" width="100%" height={40} />
              </div>
            ))}
          */}
            {messages.map((message) => (
              <div key={message.id} className="bg-gray-100 m-2 p-3 rounded-lg shadow" style={{ height: 100 }}>
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
        {/*
        <h2 className="ml-auto text-base font-semibold text-gray-900 bg-gray-100 px-4 py-1 border-2 border-gray-200 rounded-t-lg">
          {username}
        </h2>
        */}
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
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            },
          }}
        />
      </div>
    </main>
  );
}
