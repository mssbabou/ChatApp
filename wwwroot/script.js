const connection = new signalR.HubConnectionBuilder()
.withUrl("/chatHub")
.build();

document.getElementById("send-button").onclick = function() {
    if (document.getElementById("message-input").value.trim() != "")
    {
        const message = document.getElementById("message-input").value;
    document.getElementById("message-input").value = "";
    connection.invoke("SendMessage", "User", message).catch(function(err) {
        return console.error(err.toString());
    });
    }
    
};

document.getElementById("message-input").addEventListener("keypress",function(event){
    document.getElementById("character-input").textContent = document.getElementById("message-input").value.length+1 + "/500";
    if (event.key === 'Enter' && document.getElementById("message-input").value.trim() != "")
    {
        event.preventDefault();
        document.getElementById("send-button").click();
        document.getElementById("message-input").value = "";
    }
});




connection.on("ReceiveMessage", function (chatMessage) {

    var newMessage = document.createElement("div");
    newMessage.className = chatMessage.user == connection.connectionId ? "message sent" : "message received";
    newMessage.textContent = chatMessage.message;

    document.getElementById("message-list").appendChild(newMessage);

    console.log(user + ": " + message);
});

connection.start().catch(function(err) {
    return console.error(err.toString())
});
