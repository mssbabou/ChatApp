const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub", { accessTokenFactory: () => 'f4bc5f0c-a743-4c4b-8591-a33946c820ee' })
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

    fetch('/api/GetMessage?id=' + id)
    var newMessage = document.createElement("div");
    newMessage.className = chatMessage.user == connection.connectionId ? "message sent" : "message received";
    newMessage.textContent = chatMessage.message;

    document.getElementById("message-list").appendChild(newMessage);

    console.log(user + ": " + message);
});

connection.start().catch(function(err) {
    return console.error(err.toString())
});
