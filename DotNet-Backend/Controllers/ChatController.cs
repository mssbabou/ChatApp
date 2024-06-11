using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

[Route("api")]
public class ChatController : Controller
{
    private readonly ChatService chatService;

    public ChatController(ChatService chatFacade)
    {
        chatService = chatFacade;
    }

    [HttpGet("GetMessagesBehind")]
    public async Task<IActionResult> GetMessagesBehind(string id, int count = 10)
    {
        try
        {
            const int maxCount = 100;
            if (count > maxCount) count = maxCount;

            var messages = await chatService.GetMessagesBehindAsync(id, count);
            return Ok(new ChatRestApiResponse<List<ChatMessageDTO>> { Data = messages });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ChatRestApiResponse<string> { Status = false, StatusMessage = ex.Message });
        }
    }

    [HttpGet("GetMessagesDesc")]
    public async Task<IActionResult> GetMessagesDesc(string chatId = "", int start = 0, int count = 10)
    {
        try
        {
            const int maxCount = 100;
            if (count > maxCount) count = maxCount;

            var messages = await chatService.GetMessagesDescAsync(chatId, start, count);
            return Ok(new ChatRestApiResponse<List<ChatMessageDTO>> { Data = messages });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ChatRestApiResponse<string> { Status = false, StatusMessage = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("GetMessage")]
    public async Task<IActionResult> GetMessage(string id)
    {
        try
        {
            var message = await chatService.GetMessageAsync(id);
            return Ok(new ChatRestApiResponse<ChatMessageDTO> { Data = message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ChatRestApiResponse<string> { Status = false, StatusMessage = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("AddMessage")]
    public async Task<IActionResult> AddMessage(string chatId, [FromBody] string message)
    {
        try
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            string userId = chatService.GetApiKey(HttpContext);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var dbMessage = await chatService.AddMessageAsync(userId, chatId, message);

            sw.Stop();
            Console.WriteLine($"Messaged Added in {sw.ElapsedMilliseconds}ms");
            return Ok(new ChatRestApiResponse<ChatMessageDTO> { Data = dbMessage });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ChatRestApiResponse<string> { Status = false, StatusMessage = ex.Message });
        }
    }

    [HttpGet("GetRankedChatIds")]
    public async Task<IActionResult> GetRankedChatIds(int count = 5)
    {
        try
        {
            var chatIds = chatService.GetRankedChatIdsAsync(count);
            return Ok(new ChatRestApiResponse<ChatIdUsageMetric[]> { Data = chatIds });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ChatRestApiResponse<string> { Status = false, StatusMessage = ex.Message });
        }
    }

    [HttpPost("UploadFile")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0) 
                return StatusCode(400, new ChatRestApiResponse<string> { Status = false, StatusMessage = "" });

            var fileName = await chatService.UploadFileAsync(file);

            return Ok(new ChatRestApiResponse<string> { Data = fileName });
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
            var user = await chatService.RequestUserAsync();
            return Ok(new ChatRestApiResponse<PrivateUserDTO> { Data = user });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ChatRestApiResponse<string> { Status = false, StatusMessage = ex.Message });
        }
    }

    [HttpGet("GetPrivateUser")]
    public async Task<IActionResult> GetPrivateUser(string privateUserId)
    {
        try
        {
            var user = await chatService.GetPrivateUserAsync(privateUserId);
            return Ok(new ChatRestApiResponse<PrivateUserDTO> { Data = user });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ChatRestApiResponse<string> { Status = false, StatusMessage = ex.Message });
        }
    }

    [HttpGet("GetPublicUser")]
    public async Task<IActionResult> GetPublicUser(string publicUserId)
    {
        try
        {
            var user = await chatService.GetPublicUserAsync(publicUserId);
            return Ok(new ChatRestApiResponse<PublicUserDTO> { Data = user });
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