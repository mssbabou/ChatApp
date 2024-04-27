let connection = null;

// Function to initialize the API key and SignalR connection
async function initialize() {
    try {
        let privateUserId = localStorage.getItem("privateUserId");
        let publicUserId = null;
        if (privateUserId)
        {            
            const user = await fetchPrivateUser(privateUserId);
            console.log(user);
            if (user == null)
            {
                const user = await fetchUserRequest();
                privateUserId = user.privateUserId;
                publicUserId = user.publicUserId;
                localStorage.setItem("privateUserId", privateUserId);
                console.log("API key not found in database");
            }
            else
            {
                publicUserId = user.publicUserId;
                console.log("API key found in database");
            }
        }
        else
        {
            const user = await fetchUserRequest();
            privateUserId = user.privateUserId;
            publicUserId = user.publicUserId;
            localStorage.setItem("privateUserId", privateUserId);
        }
        
        await setupChatHubConnection(privateUserId);

        console.log(privateUserId);
        AddChatMessages(await fetchMessages(0, 100, privateUserId), publicUserId);

        setupAPIInteractions(privateUserId, publicUserId);
    } catch (err) {
        console.error("Error initializing the application:", err);
    }
}

// Set up API interactions that use the API key
function setupAPIInteractions(privateUserId, publicUserId) {
    document.getElementById("send-button").onclick = async () => {
        const inputElement = document.getElementById("message-input");
        const message = inputElement.value.trim();
        if (message) {
            try {
                await fetchAddMessage(message, privateUserId);
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

    connection.on("NotifyMessage", async (id) => {
        try {
            const message = await fetchMessage(id, privateUserId);
            if (message) {
                AddChatMessage(message, publicUserId);
            }
        } catch (err) {
            console.error("Error receiving message:", err);
        }
    });

    connection.on("UserConnected", (user) => {
        console.log(`User Connected: ${user.username}`);
        AddChatUser(user, true);
    });

    connection.on("UserDisconnected", (user) => {
        console.log(`User Disconnected: ${user.username}`);
        AddChatUser(user, false);
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

// Fetch a private user
async function fetchPrivateUser(privateUserId) {
    const response = await fetch(`/api/getPrivateUser?privateUserId=${privateUserId}`);
    const data = await response.json();
    if (!data || !data.status) {
        return null;
    }
    return data.data;
}

// Fetch a user request
async function fetchUserRequest() {
    const response = await fetch('/api/requestUser');
    const data = await response.json();
    if (!data || !data.status) {
        return null;
    }
    return data.data;
}

// Add a message to the server
async function fetchAddMessage(message, apiKey) {
    const response = await fetch(`/api/AddMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey
        },
        body: JSON.stringify(message)
    });
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

function AddChatMessages(messages, publicUserId) {
    messages.forEach(message => {
        AddChatMessage(message, publicUserId);
    });
}

// Function to add a chat message to the DOM
function AddChatMessage(message, publicUserId) {
    const messageHtml = createMessageTemplate(message, publicUserId == message.publicUserId);
    const messageList = document.getElementById("message-list");
    messageList.innerHTML += messageHtml;
}

function AddChatUser(user, connected) {
    const userHtml = connected ? createUserConnectedTemplate(user) : createUserDisconnectedTemplate(user);
    const messageList = document.getElementById("message-list");
    messageList.innerHTML += userHtml;

}

function createUserConnectedTemplate(user) {
    return `
        <div class="userConnected">${user.username} connected</div>
    `;
}

function createUserDisconnectedTemplate(user) {
    return `
        <div class="userConnected">${user.username} disconnected</div>
    `;
}


function createMessageTemplate(message, sent = false) {
    return `
        <div class="message ${sent ? "sent" : "received"}">
            <div class="message-header">
                <h2>${message.userName}</h2>
                <span>${new Date(message.timeStamp).toLocaleString('en-GB')}</span>
            </div>
            <div class="message-body">
                <p>${message.message}</p>
            </div>
        </div>
    `;
}

// Start the application
initialize();
