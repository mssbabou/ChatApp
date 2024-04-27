using System.Collections.Concurrent;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

public class ChatHub(ChatDatabaseService chatDatabaseService, IApiKeyService apiKeyService) : Hub
{
    #region Fields
    private static ConcurrentDictionary<string, string> users = new();

    private readonly ChatDatabaseService chatDatabaseService = chatDatabaseService;
    private readonly IApiKeyService apiKeyService = apiKeyService;
    #endregion

    public override async Task OnConnectedAsync()
    {
        string userid = apiKeyService.GetApiKey(Context.GetHttpContext());
        if (string.IsNullOrEmpty(userid))
        {
            Context.Abort();
            return;
        }

        User user = await chatDatabaseService.GetPrivateUserAsync(userid);

        bool userAlreadyConnected = users.Values.Contains(userid);
        users.TryAdd(Context.ConnectionId, userid);

        if (!userAlreadyConnected)
            await Clients.All.SendAsync("UserConnected", new PublicUserView(user));

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        users.TryRemove(Context.ConnectionId, out string userid);
        bool userStillConnected = users.Values.Contains(userid);

        User user = await chatDatabaseService.GetPrivateUserAsync(userid);

        if(!userStillConnected)
            await Clients.All.SendAsync("UserDisconnected", new PublicUserView(user));

        await base.OnDisconnectedAsync(exception);
    }
}