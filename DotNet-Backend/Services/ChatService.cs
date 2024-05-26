using MongoDB.Bson;

public class ChatService
{
    private readonly ChatDatabaseService chatDatabaseService;
    private readonly NotificationService notificationService;
    private readonly IApiKeyService apiKeyService;
    private readonly NameGenerator nameGenerator;
    private readonly FileStorageService fileStorage;

    public ChatService(ChatDatabaseService chatDatabaseService, 
                      NotificationService notificationService,
                      IApiKeyService apiKeyService, 
                      NameGenerator nameGenerator,
                      FileStorageService fileStorage)
    {
        this.chatDatabaseService = chatDatabaseService;
        this.notificationService = notificationService;
        this.apiKeyService = apiKeyService;
        this.nameGenerator = nameGenerator;
        this.fileStorage = fileStorage;
    }

    public async Task<List<ChatMessageDTO>> GetMessagesBehindAsync(string id, int count)
    {
        var messages = await chatDatabaseService.GetMessagesBehindAsync(id, count);
        return messages.Select(m => new ChatMessageDTO(m)).ToList();
    }

    public async Task<List<ChatMessageDTO>> GetMessagesDescAsync(string chatId, int start, int count)
    {
        var messages = await chatDatabaseService.GetMessagesDescAsync(chatId, start, count);
        return messages.Select(m => new ChatMessageDTO(m)).ToList();
    }

    public async Task<ChatMessageDTO> GetMessageAsync(string id)
    {
        var message = await chatDatabaseService.GetMessageAsync(new ObjectId(id));
        return new ChatMessageDTO(message);
    }

    public async Task<ChatMessageDTO> AddMessageAsync(string userId, string chatId, string message)
    {
        var user = await chatDatabaseService.GetPrivateUserAsync(userId);
        var dbMessage = await chatDatabaseService.AddMessageAsync(new ChatMessage(new PublicUserDTO(user), chatId ?? "", message));
        await notificationService.NotifyClients(chatId, dbMessage.Id);
        return new ChatMessageDTO(dbMessage);
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        int fileSizeLimit = 5 * 1024 * 1024; // 5 MB
        if (file.Length > fileSizeLimit) 
            throw new Exception("File Size limit exceeded");

        return await fileStorage.SaveFileAsync(file);
    }

    public async Task<PrivateUserDTO> RequestUserAsync()
    {
        var user = await chatDatabaseService.AddUserAsync(await nameGenerator.GetRandomUniqueName());
        return new PrivateUserDTO(user);
    }

    public async Task<PrivateUserDTO> GetPrivateUserAsync(string privateUserId)
    {
        var user = await chatDatabaseService.GetPrivateUserAsync(privateUserId);
        return new PrivateUserDTO(user);
    }

    public async Task<PublicUserDTO> GetPublicUserAsync(string publicUserId)
    {
        var user = await chatDatabaseService.GetPublicUserAsync(publicUserId);
        return new PublicUserDTO(user);
    }

    public string GetApiKey(HttpContext context)
    {
        return apiKeyService.GetApiKey(context);
    }
}
