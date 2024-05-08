"use client";
import { useState, useEffect, useRef } from "react";
import FlipMove from "react-flip-move";
import InfiniteScroll from "react-infinite-scroll-component";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";

export default function Home() {
  const [messageField, setMessageField] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animateNewMessage, setAnimateNewMessage] = useState(true);
  const scrollableDivRef = useRef(null);

  const [messageOffset, setMessageOffset] = useState(0);

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
      userName: username,
      message: messageField,
    };
    setAnimateNewMessage(true);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageField("");
  }

  function fetchMessages(animate = false) {
    if (loading) return; // Prevent multiple loads
    setLoading(true);
    setAnimateNewMessage(animate);
    console.log("Fetching messages from the backend. ", messageOffset, messageOffset + 10);

    fetch(`http://localhost:5001/api/GetMessagesDesc?start=${messageOffset}&count=10`)
      .then((response) => response.json())
      .then((data) => {
        setMessageOffset(prevOffset => prevOffset + 10);
        console.log("Received messages from the backend:", data);
        appendMessages(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch messages from the backend:", error);
        setLoading(false);
      });
  }

  function appendMessages(data) {
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
      <div
        ref={scrollableDivRef}
        id="scrollableDiv"
        className="flex-grow overflow-auto mt-3 mb-3 rounded-xl border-2 border-gray-200 flex flex-col-reverse"
        style={{ minWidth: 700 }}
      >
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
              <ChatMessage key={message.id} message={message} />
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
        <ChatInput messageField={messageField} handleMessageFieldChange={handleMessageFieldChange} sendMessage={sendMessage} />
      </div>
    </main>
  );
}
