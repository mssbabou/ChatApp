using MongoDB.Bson;

public class ChatService
{
    private readonly ChatDatabaseService _chatDatabaseService;
    private readonly NotificationService _notificationService;
    private readonly IApiKeyService _apiKeyService;
    private readonly NameGenerator _nameGenerator;
    private readonly LocalFileStorage _fileStorage;

    public ChatService(ChatDatabaseService chatDatabaseService, 
                      NotificationService notificationService,
                      IApiKeyService apiKeyService, 
                      NameGenerator nameGenerator,
                      LocalFileStorage fileStorage)
    {
        _chatDatabaseService = chatDatabaseService;
        _notificationService = notificationService;
        _apiKeyService = apiKeyService;
        _nameGenerator = nameGenerator;
        _fileStorage = fileStorage;
    }

    public async Task<List<ChatMessageDTO>> GetMessagesBehindAsync(string id, int count)
    {
        var messages = await _chatDatabaseService.GetMessagesBehindAsync(id, count);
        return messages.Select(m => new ChatMessageDTO(m)).ToList();
    }

    public async Task<List<ChatMessageDTO>> GetMessagesDescAsync(string chatId, int start, int count)
    {
        var messages = await _chatDatabaseService.GetMessagesDescAsync(chatId, start, count);
        return messages.Select(m => new ChatMessageDTO(m)).ToList();
    }

    public async Task<ChatMessageDTO> GetMessageAsync(string id)
    {
        var message = await _chatDatabaseService.GetMessageAsync(new ObjectId(id));
        return new ChatMessageDTO(message);
    }

    public async Task<ChatMessageDTO> AddMessageAsync(string userId, string chatId, string message)
    {
        var user = await _chatDatabaseService.GetPrivateUserAsync(userId);
        var dbMessage = await _chatDatabaseService.AddMessageAsync(new ChatMessage(new PublicUserDTO(user), chatId, message));
        await _notificationService.NotifyClients(dbMessage.Id);
        return new ChatMessageDTO(dbMessage);
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        int fileSizeLimit = 5 * 1024 * 1024; // 5 MB
        if (file.Length > fileSizeLimit) 
            throw new Exception("File Size limit exceeded");

        return await _fileStorage.SaveFileAsync(file);
    }

    public async Task<PrivateUserDTO> RequestUserAsync()
    {
        var user = await _chatDatabaseService.AddUserAsync(await _nameGenerator.GetRandomUniqueName());
        return new PrivateUserDTO(user);
    }

    public async Task<PrivateUserDTO> GetPrivateUserAsync(string privateUserId)
    {
        var user = await _chatDatabaseService.GetPrivateUserAsync(privateUserId);
        return new PrivateUserDTO(user);
    }

    public async Task<PublicUserDTO> GetPublicUserAsync(string publicUserId)
    {
        var user = await _chatDatabaseService.GetPublicUserAsync(publicUserId);
        return new PublicUserDTO(user);
    }

    public string GetApiKey(HttpContext context)
    {
        return _apiKeyService.GetApiKey(context);
    }
}
