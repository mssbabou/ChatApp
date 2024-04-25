using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

[Authorize]
public class ChatHub(NotificationService notificationService) : Hub
{
    #region Fields
    private readonly NotificationService notificationService = notificationService;
    #endregion
}