const connection = new signalR.HubConnectionBuilder()
.withUrl("/chatHub")
.build();

document.getElementById("send-button").onclick = function() {
    const message = document.getElementById("message-input").value;

    connection.invoke("SendMessage", "User", message).catch(function(err) {
        return console.error(err.toString());
    });
};

connection.on("ReceiveMessage", function (user, message) {

    var newMessage = document.createElement("div");
    newMessage.className = user == connection.connectionId ? "message sent" : "message received";
    newMessage.textContent = message;

    document.getElementById("message-list").appendChild(newMessage);

    console.log(user + ": " + message);
});

connection.start().catch(function(err) {
    return console.error(err.toString())
});
