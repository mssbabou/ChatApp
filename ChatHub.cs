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
        ChatMessage chatMessage = new ChatMessage(Context.ConnectionId, message);
        await Clients.All.SendAsync("ReceiveMessage", chatMessage);
        await chatDatabaseService.TryAddMessageAsync(chatMessage);
    }
}