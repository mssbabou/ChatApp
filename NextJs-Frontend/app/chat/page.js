"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import FlipMove from "react-flip-move";
import InfiniteScroll from "react-infinite-scroll-component";
import * as signalR from "@microsoft/signalr";
import { useSearchParams } from 'next/navigation';
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";

const ChatComponent = () => {
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get('c');

  const [messageField, setMessageField] = useState("");
  const [oldestMessage, setOldestMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [animateMessage, setAnimateMessage] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [messageOffset, setMessageOffset] = useState(0);
  const initialized = useRef(false);
  const scrollableDivRef = useRef(null);

  const userRef = useRef(null);
  const setUser = (data) => {
    userRef.current = data;
  };

  let connection;

  const BackEndEndpoint = ""; //http://localhost:5001";

  useEffect(() => {
    if (!initialized.current) {
      Initialize();
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    setMessageCount(messages.length);
    if (isUserAtBottom()) {
      scrollToBottom();
    }
  }, [messages]);

  const handleMessageFieldChange = (event) => {
    setMessageField(event.target.value);
  };

  async function Initialize() {
    await requestUser();
    await fetchOldMessages(20);
    await setupChatHubConnection(userRef.current.privateUserId);
  }

  async function setupChatHubConnection(apiKey) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BackEndEndpoint}/chathub`, { accessTokenFactory: () => apiKey })
      .build();

    try {
      await connection.start();

      connection.on("NotifyMessage", async (id) => {
        try {
          console.log("THE SHITTY USER", userRef.current);
          console.log("Received message notification:", id);
          await fetchMessage(id, apiKey);
        } catch (err) {
          console.error("Error receiving message:", err);
        }
      });
    } catch (err) {
      console.error("Error starting connection:", err);
    }
  }

  async function requestUser() {
    const privateUserId = localStorage.getItem("privateUserId");
    console.log("Private User ID:", privateUserId);
    if (privateUserId) {
      const user = await fetchPrivateUser(privateUserId);
      console.log("User from local storage:", user);
      if (user) return user;
    }

    try {
      const response = await fetch(`${BackEndEndpoint}/api/RequestUser`);
      const data = await response.json();

      if (data == null || !data.status)
        throw new Error("Failed to fetch user from the backend.");

      setUser(data.data);

      localStorage.setItem("privateUserId", data.data.privateUserId);

      return data.data;
    } catch (error) {
      console.error("Failed to fetch user from the backend:", error);
      return null;
    }
  }

  async function fetchPrivateUser(privateUserId) {
    try {
      const response = await fetch(
        `${BackEndEndpoint}/api/GetPrivateUser?privateUserId=${privateUserId}`
      );
      const data = await response.json();

      if (data == null || !data.status)
        throw new Error("Failed to fetch user from the backend.");

      setUser(data.data);

      return data.data;
    } catch (error) {
      console.error("Failed to fetch user from the backend:", error);
      return null;
    }
  }

  async function sendMessage() {
    if (!messageField) return;

    setAnimateMessage(true);
    const response = await fetch(`${BackEndEndpoint}/api/AddMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": userRef.current.privateUserId,
      },
      body: JSON.stringify(messageField),
    });
    const data = await response.json();

    if (data == null || !data.status)
      throw new Error("Failed to send message to the backend.");

    console.log("Message sent to the backend:", data);

    scrollToBottom();

    setMessageField("");
  }

  async function fetchMessage(id, apiKey, animate = true) {
    setAnimateMessage(animate);
    console.log("Fetching message from the backend:", id);

    try {
      const response = await fetch(
        `${BackEndEndpoint}/api/GetMessage?id=${id}`,
        {
          headers: { "X-Api-Key": apiKey },
        }
      );
      const data = await response.json();

      if (data == null || !data.status)
        throw new Error("Failed to fetch message from the backend.");

      const newMessage = data.data;

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error("Failed to fetch message from the backend:", error);
    }
  }

  async function fetchOldMessages(count = 10, animate = false) {
    setAnimateMessage(animate);
    console.log(
      "Fetching messages from the backend.",
      messageOffset,
      messageOffset + count
    );

    try {
      const response = await fetch(
        `${BackEndEndpoint}/api/GetMessagesDesc?start=${messageOffset}&count=${count}`
      );
      const data = await response.json();

      if (data == null || !data.status)
        throw new Error("Failed to fetch messages from the backend.");

      setMessageOffset((prevOffset) => prevOffset + data.data.length);
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
    console.log(
      "Fetching messages from the backend.",
      messageOffset,
      messageOffset + count
    );

    try {
      const response = await fetch(
        `${BackEndEndpoint}/api/GetMessagesBehind?id=${oldestMessage}&count=${count}`
      );
      const data = await response.json();

      if (data == null || !data.status)
        throw new Error("Failed to fetch messages from the backend.");

      setMessageOffset((prevOffset) => prevOffset + data.data.length);
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

  function isUserAtBottom() {
    if (!scrollableDivRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = scrollableDivRef.current;
    return scrollHeight - scrollTop === clientHeight;
  }

  function scrollToBottom() {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  }

  return (
    <main className="flex flex-col items-center justify-between h-screen">
      <div
        id="scrollableDiv"
        className="flex flex-col-reverse overflow-auto my-2"
        style={{ maxWidth: 800, width: "100%" }}
        ref={scrollableDivRef}
      >
        <InfiniteScroll
          scrollThreshold={0.9}
          dataLength={messageCount}
          next={fetchMessagesBehind}
          hasMore={hasMore}
          inverse={true}
          scrollableTarget="scrollableDiv"
        >
          <FlipMove duration={175} disableAllAnimations={!animateMessage}>
            {messages.map((message) => (
              <ChatMessage
                key={message.timeStamp}
                isAuthor={message.userName == userRef.current.username}
                message={message}
              />
            ))}
          </FlipMove>
        </InfiniteScroll>
      </div>
      <div
        className="flex flex-col"
        style={{ maxWidth: 800, width: "100%" }}
      >
        <ChatInput
          handleMessageFieldChange={handleMessageFieldChange}
          sendMessage={sendMessage}
          messageField={messageField}
          reciever={initialChatId}
        />
      </div>
    </main>
  );
}

const ChatPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatComponent />
    </Suspense>
  );
}

export default ChatPage;
