using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

[Authorize]
public class ChatHub : Hub
{
    private readonly ChatDatabaseService chatDatabaseService;
    private readonly IApiKeyService apiKeyService;

    public ChatHub(ChatDatabaseService chatDatabaseService, IApiKeyService apiKeyService)
    {
        this.chatDatabaseService = chatDatabaseService;
        this.apiKeyService = apiKeyService;
    }

    public async Task SendMessage(string message)
    {
        string userId = apiKeyService.GetApiKey(Context.GetHttpContext());
        if (string.IsNullOrEmpty(userId)) return;

        User user = await chatDatabaseService.GetPrivateUserAsync(userId);
        ChatMessage chatMessage = new ChatMessage(new PublicUserView(user), message);
        chatMessage = await chatDatabaseService.AddMessageAsync(chatMessage);
        await Clients.All.SendAsync("ReceiveMessage", chatMessage.Id);
    }
}