using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api")]
public class ChatRestApi : Controller
{
    private readonly ChatDatabaseService chatDatabaseService;

    public ChatRestApi(ChatDatabaseService chatDatabaseService)
    {
        this.chatDatabaseService = chatDatabaseService;
    }

    [HttpGet("GetMessagesDesc")]
    public async Task<IActionResult> GetLastMessagesDesc(int start = 0, int count = 100)
    {
        try
        {
            var messages = await chatDatabaseService.GetLastMessagesAsync(start, count);
            return Ok(new ChatRestApiResponse<List<ChatMessage>> { Data = messages });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ChatRestApiResponse<string> { Status = false, StatusMessage = ex.Message });
        }
    }

    [HttpGet("GetMessage")]
    public async Task<IActionResult> GetMessage(string id)
    {
        try
        {
            ChatMessage message = await chatDatabaseService.GetMessageAsync(id);
            return Ok(new ChatRestApiResponse<ChatMessage> { Data = message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ChatRestApiResponse<string> { Status = false, StatusMessage = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("AddMessage")]
    public async Task<IActionResult> AddMessage([FromBody] ChatMessage message)
    {
        try
        {
            ChatMessage dbMessage = await chatDatabaseService.AddMessageAsync(message);
            return Ok(new ChatRestApiResponse<ChatMessage> { Data = dbMessage });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ChatRestApiResponse<string> { Status = false, StatusMessage = ex.Message });
        }
    }

    [HttpGet("RequestUser")]
    public async Task<IActionResult> RequestUser()
    {
        try
        {
            User user = new User("Markus"); // implement random name generation
            user = await chatDatabaseService.AddUserAsync(user);
            return Ok(new ChatRestApiResponse<User> { Data = user });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ChatRestApiResponse<string> { Status = false, StatusMessage = ex.Message });
        }
    
    }
}

public class ChatRestApiResponse<T>
{
    public bool Status { get; set; } = true;
    public string StatusMessage { get; set; } = "ok";
    public T? Data { get; set; }
}