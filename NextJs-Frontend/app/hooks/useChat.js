import { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

const useChat = (initialChatId, isDevelopment) => {
  const [chatId, setChatId] = useState(initialChatId);
  const [oldestMessage, setOldestMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [animateMessage, setAnimateMessage] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [messageOffset, setMessageOffset] = useState(0);

  const initialized = useRef(false);
  const userRef = useRef(null);
  const connectionRef = useRef(null);
  const scrollableDivRef = useRef(null);

  const BackEndEndpoint = isDevelopment ? "http://localhost:5001" : "";

  useEffect(() => {
    if (!initialized.current) {
      initializeChat();
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    setMessageCount(messages.length);
  }, [messages]);

  const setUser = (data) => {
    userRef.current = data;
  };

  const initializeChat = async () => {
    await requestUser();
    await fetchOldMessages(20);
    await setupChatHubConnection(userRef.current.privateUserId);
  };

  const setupChatHubConnection = async (apiKey) => {
    connectionRef.current = new signalR.HubConnectionBuilder()
      .withUrl(`${BackEndEndpoint}/chathub`, { accessTokenFactory: () => apiKey })
      .build();

    try {
      await connectionRef.current.start();

      connectionRef.current.invoke("JoinGroup", initialChatId).then(() => {
          connectionRef.current.on("RecieveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
          });
          /* OLD SLOW WAY
          connectionRef.current.on("NotifyMessage", async (id) => {
            try {
              console.log("Received message notification:", id);
              await fetchMessage(id, apiKey);
            } catch (err) {
              console.error("Error receiving message:", err);
            }
          });
          */
        });
    } catch (err) {
      console.error("Error starting connection:", err);
    }
  };

  const requestUser = async () => {
    const privateUserId = localStorage.getItem("privateUserId");
    if (privateUserId) {
      const user = await fetchPrivateUser(privateUserId);
      if (user) return user;
    }

    try {
      const response = await fetch(`${BackEndEndpoint}/api/RequestUser`);
      const data = await response.json();

      if (!data || !data.status) throw new Error("Failed to fetch user from the backend.");

      setUser(data.data);
      localStorage.setItem("privateUserId", data.data.privateUserId);

      return data.data;
    } catch (error) {
      console.error("Failed to fetch user from the backend:", error);
      return null;
    }
  };

  const fetchPrivateUser = async (privateUserId) => {
    try {
      const response = await fetch(`${BackEndEndpoint}/api/GetPrivateUser?privateUserId=${privateUserId}`);
      const data = await response.json();

      if (!data || !data.status) throw new Error("Failed to fetch user from the backend.");

      setUser(data.data);
      return data.data;
    } catch (error) {
      console.error("Failed to fetch user from the backend:", error);
      return null;
    }
  };

  const sendMessage = async (message) => {
    if (!message) return false;

    setAnimateMessage(true);
    const response = await fetch(`${BackEndEndpoint}/api/AddMessage?chatId=${initialChatId != null ? initialChatId : ""}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": userRef.current.privateUserId,
      },
      body: JSON.stringify(message),
    });
    const data = await response.json();

    if (!data || !data.status) return false;

    scrollToBottom();

    return true;
  };

  const fetchMessage = async (id, apiKey, animate = true) => {
    setAnimateMessage(animate);

    try {
      const response = await fetch(`${BackEndEndpoint}/api/GetMessage?id=${id}`, {
        headers: { "X-Api-Key": apiKey },
      });
      const data = await response.json();

      if (!data || !data.status) throw new Error("Failed to fetch message from the backend.");

      const newMessage = data.data;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error("Failed to fetch message from the backend:", error);
    }
  };

  const fetchOldMessages = async (count = 10, animate = false) => {
    setAnimateMessage(animate);

    try {
      const response = await fetch(`${BackEndEndpoint}/api/GetMessagesDesc?chatid=${initialChatId != null ? initialChatId : ""}&start=${messageOffset}&count=${count}`);
      const data = await response.json();

      if (!data || !data.status) throw new Error("Failed to fetch messages from the backend.");

      setMessageOffset((prevOffset) => prevOffset + data.data.length);
      appendOldMessages(data.data);

      if (data.data.length === 0) {
        setHasMore(false);
        return;
      }

      setOldestMessage(data.data[0].id);
    } catch (error) {
      console.error("Failed to fetch messages from the backend:", error);
    }
  };

  const fetchMessagesBehind = async (count = 10) => {
    setAnimateMessage(false);

    try {
      const response = await fetch(`${BackEndEndpoint}/api/GetMessagesBehind?id=${oldestMessage}&count=${count}`);
      const data = await response.json();

      if (!data || !data.status) throw new Error("Failed to fetch messages from the backend.");

      setMessageOffset((prevOffset) => prevOffset + data.data.length);
      appendOldMessages(data.data);

      if (data.data.length === 0) {
        setHasMore(false);
        return;
      }

      setOldestMessage(data.data[0].id);
    } catch (error) {
      console.error("Failed to fetch messages from the backend:", error);
    }
  };

  const fetchUploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BackEndEndpoint}/api/UploadFile`, {
        method: "POST",
        headers: {
          "X-Api-Key": userRef.current.privateUserId,
        },
        body: formData,
      });
      const data = await response.json();

      if (!data || !data.status) return null;

      return data.data;
    }
    catch (error) {
      console.error("Failed to upload file to the backend:", error);
      return null;
    }
  }

  const appendOldMessages = (data) => {
    const newMessages = data.map((message) => ({
      id: message.id,
      timeStamp: message.timeStamp,
      userName: message.userName,
      message: message.message,
    }));

    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
  };

  const scrollToBottom = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  };

  return {
    chatId,
    setChatId,
    messages,
    messageCount,
    hasMore,
    sendMessage,
    fetchMessagesBehind,
    fetchUploadFile,
    setAnimateMessage,
    animateMessage,
    scrollToBottom,
    initialized,
    userRef,
    scrollableDivRef,
  };
};

export default useChat;
