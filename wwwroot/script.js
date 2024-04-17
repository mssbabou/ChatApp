const apiKey = 'f4bc5f0c-a743-4c4b-8591-a33946c820ee'; // RETARTED HARD CODED API KEY!

fetch('/api/GetMessagesDesc', {
    headers: {
        'X-Api-Key': apiKey
    }
})
.then(response => response.json())
.then(data => {
    if (data == null || !data.status) return;

    var chatMessages = data.data;

    chatMessages.forEach(message => {
        AddChatMessage(message);
    });
});

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub", { accessTokenFactory: () => apiKey })
    .build();

document.getElementById("send-button").onclick = function() {
    if (document.getElementById("message-input").value.trim() != "")
    {
        const message = document.getElementById("message-input").value;
    document.getElementById("message-input").value = "";
    connection.invoke("SendMessage", message).catch(function(err) {
        return console.error(err.toString());
    });
    }
    
};

document.getElementById("message-input").addEventListener("keypress",function(event){
    document.getElementById("character-input").textContent = document.getElementById("message-input").value.length+1 + "/500";
    if (event.key === 'Enter' && document.getElementById("message-input").value.trim() != "" && document.getElementById("message-input").value.length+1 <= 500)
    {
        event.preventDefault();
        document.getElementById("send-button").click();
        document.getElementById("message-input").value = "";
    }
});

connection.on("ReceiveMessage", function (id) {
    console.log("Received message with id: " + id);
    fetch('/api/GetMessage?id=' + id, {
        headers: {
            'X-Api-Key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data == null || !data.status) return;

        var chatMessage = data.data;

        AddChatMessage(chatMessage);

        console.log(user + ": " + message);
    });
});

connection.start().catch(function(err) {
    return console.error(err.toString())
});

function AddChatMessage(message)
{
    var newMessage = document.createElement("div");
    newMessage.className = message.user == connection.connectionId ? "message sent" : "message received";
    newMessage.textContent = message.message;

    document.getElementById("message-list").appendChild(newMessage);    
}