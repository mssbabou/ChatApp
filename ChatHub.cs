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

            User user = await chatDatabaseService.GetPrivateUserAsync(userId);
            ChatMessage chatMessage = new ChatMessage(new PublicUserView(user), message);
            chatMessage = await chatDatabaseService.AddMessageAsync(chatMessage);
            await Clients.All.SendAsync("ReceiveMessage", chatMessage.Id);
        }
    }
}