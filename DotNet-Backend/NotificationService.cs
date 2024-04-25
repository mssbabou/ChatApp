using Microsoft.AspNetCore.SignalR;

public class NotificationService(IHubContext<ChatHub> chatHubContext)
{
    #region Fields
    private const string NotifyMessageMethod = "NotifyMessage";

    private readonly IHubContext<ChatHub> chatHubContext = chatHubContext;
    #endregion

    #region Methods
    public async Task NotifyClients(string id)
    {
        await chatHubContext.Clients.All.SendAsync(NotifyMessageMethod, id);
    }
    #endregion
}