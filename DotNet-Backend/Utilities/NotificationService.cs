using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;

public class NotificationService(IHubContext<ChatHub> chatHubContext)
{
    #region Fields
    private const string NotifyMessageMethod = "NotifyMessage";

    private readonly IHubContext<ChatHub> chatHubContext = chatHubContext;
    #endregion

    #region Methods
    public async Task NotifyClients(string group, ObjectId id)
    {
        await chatHubContext.Clients.Group(group ?? "").SendAsync(NotifyMessageMethod, id.ToString());
    }
    #endregion
}