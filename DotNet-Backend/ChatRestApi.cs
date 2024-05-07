using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

[Route("api")]
public class ChatRestApi : Controller
{
    #region Fields
    private readonly ChatDatabaseService chatDatabaseService;
    private readonly NotificationService notificationService;
    private readonly IApiKeyService apiKeyService;
    private readonly NameGenerator nameGenerator;
    private readonly FileStorage fileStorage;
    #endregion

    #region Constructor
    public ChatRestApi
    (
        ChatDatabaseService chatDatabaseService, 
        NotificationService notificationService,
        IApiKeyService apiKeyService, 
        NameGenerator nameGenerator,
        FileStorage fileStorage
    )
    {
        this.chatDatabaseService = chatDatabaseService;
        this.notificationService = notificationService;
        this.apiKeyService = apiKeyService;
        this.nameGenerator = nameGenerator;
        this.fileStorage = fileStorage;
    }
    #endregion

    #region Methods
    [HttpGet("GetMessagesDesc")]
    public async Task<IActionResult> GetLastMessages(int start = 0, int count = 100)
    {
        try
        {
            var messages = await chatDatabaseService.GetMessagesDescAsync(start, count);
            return Ok(new ChatRestApiResponse<List<ChatMessage>> { Data = messages });
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
    public async Task<IActionResult> AddMessage([FromBody] string message)
    {
        try
        {
            string userId = apiKeyService.GetApiKey(HttpContext);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            User user = await chatDatabaseService.GetPrivateUserAsync(userId);
            ChatMessage dbMessage = await chatDatabaseService.AddMessageAsync(new ChatMessage(new PublicUserView(user), message));

            await notificationService.NotifyClients(dbMessage.Id);

            return Ok(new ChatRestApiResponse<ChatMessage> { Data = dbMessage });
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
            int fileSizeLimit = 5 * 1024 * 1024; // 10 MB
            if (file == null || file.Length == 0) return StatusCode(400, new ChatRestApiResponse<string> { Status = false, StatusMessage = "" });
            if (file.Length > fileSizeLimit) return StatusCode(400, new ChatRestApiResponse<string> { Status = false, StatusMessage = "File Size limit exceeded" });

            string fileName = await fileStorage.SaveFileAsync(file);

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
            PrivateUserView user = new(await chatDatabaseService.AddUserAsync(await nameGenerator.GetRandomUniqueName()));
            return Ok(new ChatRestApiResponse<PrivateUserView> { Data = user });
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
            PrivateUserView user = new(await chatDatabaseService.GetPrivateUserAsync(privateUserId));
            return Ok(new ChatRestApiResponse<PrivateUserView> { Data = user });
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
            PublicUserView user = new(await chatDatabaseService.GetPublicUserAsync(publicUserId));
            return Ok(new ChatRestApiResponse<PublicUserView> { Data = user });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ChatRestApiResponse<string> { Status = false, StatusMessage = ex.Message });
        }
    }
    #endregion
}

public class ChatRestApiResponse<T>
{
    public bool Status { get; set; } = true;
    public string StatusMessage { get; set; } = "ok";
    public T? Data { get; set; }
}