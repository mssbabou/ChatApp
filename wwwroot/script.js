let connection = null;

// Function to initialize the API key and SignalR connection
async function initialize() {
    try {
        const user = await fetchUser();
        const apiKey = user.privateUserId;  // Get API key dynamically
        
        await setupChatHubConnection(apiKey);

        AddChatMessages(await fetchMessages(0, 100, apiKey));

        setupAPIInteractions(apiKey);
    } catch (err) {
        console.error("Error initializing the application:", err);
    }
}

// Set up API interactions that use the API key
function setupAPIInteractions(apiKey) {
    document.getElementById("send-button").onclick = async () => {
        const inputElement = document.getElementById("message-input");
        const message = inputElement.value.trim();
        if (message) {
            try {
                await connection.invoke("SendMessage", message);
                inputElement.value = ""; // Clear input after sending
            } catch (err) {
                console.error(err.toString());
            }
        }
    };

    document.getElementById("message-input").addEventListener("keypress", function(event) {
        const messageLength = this.value.length + 1;
        document.getElementById("character-input").textContent = `${messageLength}/500`;
        if (event.key === 'Enter' && messageLength <= 500) {
            event.preventDefault();
            document.getElementById("send-button").click();
        }
    });

    connection.on("ReceiveMessage", async (id) => {
        try {
            const message = await fetchMessage(id, apiKey);
            if (message) {
                AddChatMessage(message);
            }
        } catch (err) {
            console.error("Error receiving message:", err);
        }
    });
}

// Setup the SignalR connection
async function setupChatHubConnection(apiKey) {
    connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub", { accessTokenFactory: () => apiKey })
    .build();

    try {
        await connection.start();
    } catch (err) {
        console.error("Error starting connection:", err);
    }
}

// Fetch a user request
async function fetchUser() {
    const response = await fetch('/api/requestUser');
    const data = await response.json();
    if (!data || !data.status) {
        return null;
    }
    return data.data;
}

// Fetch a message by ID
async function fetchMessage(id, apiKey) {
    const response = await fetch(`/api/GetMessage?id=${id}`, {
        headers: { 'X-Api-Key': apiKey }
    });
    const data = await response.json();
    if (!data || !data.status) {
        return null;
    }
    return data.data;
}

// Fetch messages from the server
async function fetchMessages(start, count, apiKey) {
    const response = await fetch(`/api/GetMessagesDesc?start=${start}&count=${count}`, {
        headers: { 'X-Api-Key': apiKey }
    });
    const data = await response.json();
    if (!data || !data.status) {
        return [];
    }
    console.log(data.data);
    return data.data;
}

function AddChatMessages(messages) {
    messages.forEach(message => {
        AddChatMessage(message);
    });
}

// Function to add a chat message to the DOM
function AddChatMessage(message) {
    const newMessage = document.createElement("div");
    newMessage.className = "message received";
    newMessage.textContent = message.message;
    document.getElementById("message-list").appendChild(newMessage);
}

// Start the application
initialize();
