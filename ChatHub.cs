using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

[Authorize]
public class ChatHub : Hub
{
    private readonly ChatDatabaseService chatDatabaseService;

    public ChatHub(ChatDatabaseService chatDatabaseService)
    {
        this.chatDatabaseService = chatDatabaseService;
    }

    public async Task SendMessage(string message)
    {
        if (Context.GetHttpContext().Request.Headers.TryGetValue("Authorization", out var authorizationHeaderValues))
        {
            string userId = authorizationHeaderValues.FirstOrDefault()!["Bearer ".Length..].Trim();

            ChatMessage chatMessage = new ChatMessage(userId, message);
            await Clients.All.SendAsync("ReceiveMessage", chatMessage);
            await chatDatabaseService.AddMessageAsync(chatMessage);
        }
    }
}