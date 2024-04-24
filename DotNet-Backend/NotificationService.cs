using Microsoft.AspNetCore.SignalR;

public class NotificationService
{
    private readonly IHubContext<ChatHub> chatHubContext;

    public NotificationService(IHubContext<ChatHub> chatHubContext)
    {
        this.chatHubContext = chatHubContext;
    }

    public async Task NotifyClients(string id)
    {
        await chatHubContext.Clients.All.SendAsync("NotifyMessage", id);
    }
}