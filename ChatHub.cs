using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    private readonly ChatDatabaseService chatDatabaseService;

    public ChatHub(ChatDatabaseService chatDatabaseService)
    {
        this.chatDatabaseService = chatDatabaseService;
    }

    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", Context.ConnectionId, message);

        _ = Task.Run(async () => await chatDatabaseService.AddMessageAsync(new ChatMessage(Context.ConnectionId, message)));
    }

    public override async Task OnConnectedAsync()
    {
        await Clients.All.SendAsync("UserConnected", Context.ConnectionId);
        await base.OnConnectedAsync();
    }
}