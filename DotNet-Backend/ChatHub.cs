using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

[Authorize]
public class ChatHub : Hub
{
    #region Fields
    private readonly NotificationService notificationService;
    #endregion

    #region Constructor
    public ChatHub(NotificationService notificationService)
    {
        this.notificationService = notificationService;
    }
    #endregion
}