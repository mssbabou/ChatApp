const connection = new signalR.HubConnectionBuilder()
.withUrl("chatHub")
.build();

connection.start().catch(function(err) {
    return console.error(err.toString())
});