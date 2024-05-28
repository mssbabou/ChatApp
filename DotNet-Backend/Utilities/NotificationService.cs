using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;

public class NotificationService(IHubContext<ChatHub> chatHubContext)
{
    #region Fields
    private const string NotifyMessageMethod = "NotifyMessage";
    private const string RecieveMessageMethod = "RecieveMessage";

    private readonly IHubContext<ChatHub> chatHubContext = chatHubContext;
    #endregion

    #region Methods
    public async Task NotifyNewMessage(string group, ObjectId id)
    {
        await chatHubContext.Clients.Group(group ?? "").SendAsync(NotifyMessageMethod, id.ToString());
    }

    public async Task RecieveMessage(string group, ChatMessage message)
    {
        await chatHubContext.Clients.Group(group ?? "").SendAsync(RecieveMessageMethod, new ChatMessageDTO(message));
    }
    #endregion
}