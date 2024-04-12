using Microsoft.AspNetCore.Mvc;

public class ChatRestApi : Controller
{
    private readonly ChatDatabaseService chatDatabaseService;

    public ChatRestApi(ChatDatabaseService chatDatabaseService)
    {
        this.chatDatabaseService = chatDatabaseService;
    }

    [HttpGet("LastMessages")]
    public async Task<List<ChatMessage>> GetLastMessages(int start, int count)
    {
        return await chatDatabaseService.GetLastMessages(start, count);
    }
}