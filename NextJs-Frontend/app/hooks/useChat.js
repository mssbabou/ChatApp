import { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

export function useChat(setMessages, setHasMore, messageField) {
    const [user, setUser] = useState(null);
    const connectionRef = useRef(null);

    useEffect(() => {
        async function initializeChat() {
            const userData = await requestUser();
            if (userData) {
                await setupChatHubConnection(userData.privateUserId);
                await fetchOldMessages();
            }
        }

        initializeChat();
        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, []);

    const requestUser = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/RequestUser");
            const data = await response.json();
            if (data == null || !data.status) throw new Error("Failed to fetch user from the backend.");
            setUser(data.data);
            return data.data;
        } catch (error) {
            console.error("Failed to fetch user from the backend:", error);
            return null;
        }
    };

    const setupChatHubConnection = async (apiKey) => {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5001/chathub", { accessTokenFactory: () => apiKey })
            .build();
        connectionRef.current = connection;

        try {
            await connection.start();
            connection.on("NotifyMessage", async (id) => {
                await fetchMessage(id, apiKey);
            });
        } catch (err) {
            console.error("Error starting connection:", err);
        }
    };

    const sendMessage = async () => {
        if (!messageField) return;
        try {
            const response = await fetch("http://localhost:5001/api/AddMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": user.privateUserId
                },
                body: JSON.stringify({ message: messageField }),
            });
            const data = await response.json();
            if (data == null || !data.status) throw new Error("Failed to send message to the backend.");
            setMessages(messages => [...messages, data.data]);
        } catch (error) {
            console.error("Failed to send message to the backend:", error);
        }
    };

    const fetchOldMessages = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/GetMessagesDesc");
            const data = await response.json();
            if (data == null || !data.status) throw new Error("Failed to fetch messages from the backend.");
            setMessages(data.data);
            setHasMore(data.data.length > 0);
        } catch (error) {
            console.error("Failed to fetch messages from the backend:", error);
        }
    };

    const fetchMessage = async (id, apiKey) => {
        try {
            const response = await fetch(`http://localhost:5001/api/GetMessage?id=${id}`, {
                headers: { "X-Api-Key": apiKey }
            });
            const data = await response.json();
            if (data == null || !data.status) throw new Error("Failed to fetch message from the backend.");
            setMessages(messages => [...messages, data.data]);
        } catch (error) {
            console.error("Failed to fetch message from the backend:", error);
        }
    };

    return { user, sendMessage, fetchOldMessages, fetchMessagesBehind: () => {} };
}
