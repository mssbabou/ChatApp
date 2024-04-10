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
    console.log(user + ": " + message);
});

connection.start().catch(function(err) {
    return console.error(err.toString())
});
