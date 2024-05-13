"use client";

import { useState, useEffect, useRef } from "react";
import FlipMove from "react-flip-move";
import InfiniteScroll from "react-infinite-scroll-component";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";

import { XEmbed, YouTubeEmbed } from "react-social-media-embed";

export default function Home() {
  const [messageField, setMessageField] = useState("");
  const [oldestMessage, setOldestMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [animateMessage, setAnimateMessage] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [messageOffset, setMessageOffset] = useState(0);
  const initialized = useRef(false);  // Ref to track the initial load

  const [user, setUser] = useState(null);

  useEffect(() =>{
    if (!initialized.current) {
      requestUser();
      fetchOldMessages(20);
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    setMessageCount(messages.length);
  }, [messages]);

  const handleMessageFieldChange = (event) => {
    setMessageField(event.target.value);
  };

  async function requestUser() {
    try {
      const response = await fetch("http://localhost:5001/api/RequestUser");
      const data = await response.json();

      if(data == null || !data.status) throw new Error("Failed to fetch user from the backend.");

      setUser(data.data);

      console.log("User:", data.data);
    }
    catch (error) {
      console.error("Failed to fetch user from the backend:", error);
    }
  }

  async function sendMessage() {
    setAnimateMessage(true);
    const response = await fetch("http://localhost:5001/api/AddMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": user.privateUserId
      },
      body: JSON.stringify(messageField),
    });
    const data = await response.json();

    if(data == null || !data.status) throw new Error("Failed to send message to the backend.");

    console.log("Message sent to the backend:", data);

    const newMessage = data.data;

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageField("");
  }

  async function fetchOldMessages(count = 10, animate = false) {
    setAnimateMessage(animate);
    console.log("Fetching messages from the backend.", messageOffset, messageOffset + count);

    try {
      const response = await fetch(`http://localhost:5001/api/GetMessagesDesc?start=${messageOffset}&count=${count}`);
      const data = await response.json();

      if(data == null || !data.status) throw new Error("Failed to fetch messages from the backend.");

      setMessageOffset(prevOffset => prevOffset + data.data.length);
      console.log("Received messages from the backend:", data);
      appendOldMessages(data.data, messageOffset); 

      if (data.data.length == 0) {
        setHasMore(false);
        return;
      }

      setOldestMessage(data.data[0].id);
    } catch (error) {
      console.error("Failed to fetch messages from the backend:", error);
    }
  }

  async function fetchMessagesBehind(count = 10) {
    setAnimateMessage(false);
    console.log("Fetching messages from the backend.", messageOffset, messageOffset + count);

    try {
      const response = await fetch(`http://localhost:5001/api/GetMessagesBehind?id=${oldestMessage}&count=${count}`);
      const data = await response.json();

      if(data == null || !data.status) throw new Error("Failed to fetch messages from the backend.");

      setMessageOffset(prevOffset => prevOffset + data.data.length);
      console.log("Received messages from the backend:", data);
      appendOldMessages(data.data, messageOffset); 

      if (data.data.length == 0) {
        setHasMore(false);
        return;
      }

      setOldestMessage(data.data[0].id);
    } catch (error) {
      console.error("Failed to fetch messages from the backend:", error);
    }
  }

  function appendMessage(data) {
    const newMessage = {
      id: data.id,
      timeStamp: data.timeStamp,
      userName: data.userName,
      message: data.message,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  function appendOldMessages(data) {
    const newMessages = data.map((message) => ({
      id: message.id,
      timeStamp: message.timeStamp,
      userName: message.userName,
      message: message.message,
    }));

    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
  }

  return (
    <main className="flex flex-col items-center justify-between h-screen">
      <div id="scrollableDiv" className="flex flex-col-reverse overflow-auto my-2" style={{ maxWidth: 800, width: '100%' }}>
        {/*
        <YouTubeEmbed url="https://www.youtube.com/watch?v=I6BmakfJCBc" />
        <XEmbed url="https://twitter.com/SpaceX/status/1732824684683784516" />    
        */}  
        <InfiniteScroll dataLength={messageCount} next={fetchMessagesBehind} hasMore={hasMore} inverse={true} scrollableTarget="scrollableDiv">
          <FlipMove duration={175} disableAllAnimations={!animateMessage}>
            {messages.map((message) => (
              <ChatMessage key={message.timeStamp} message={message} />
            ))}
          </FlipMove>
        </InfiniteScroll>
      </div>
      <div className="flex flex-col" style={{ maxWidth: 800, width: '100%' }}>
        <ChatInput handleMessageFieldChange={handleMessageFieldChange} sendMessage={sendMessage} messageField={messageField}/>
      </div>
    </main>
  );
}
