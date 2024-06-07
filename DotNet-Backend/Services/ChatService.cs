using MongoDB.Bson;

public class ChatService
{
    private readonly ChatDatabaseService chatDatabaseService;
    private readonly NotificationService notificationService;
    private readonly IApiKeyService apiKeyService;
    private readonly NameGenerator nameGenerator;
    private readonly IFileStorageService fileStorage;
    private readonly ChatIdUsageMetricService chatIdUsageMetricService;

    public ChatService(ChatDatabaseService chatDatabaseService, 
                      NotificationService notificationService,
                      IApiKeyService apiKeyService, 
                      NameGenerator nameGenerator,
                      IFileStorageService fileStorage,
                      ChatIdUsageMetricService chatIdUsageMetricService)
    {
        this.chatDatabaseService = chatDatabaseService;
        this.notificationService = notificationService;
        this.apiKeyService = apiKeyService;
        this.nameGenerator = nameGenerator;
        this.fileStorage = fileStorage;
        this.chatIdUsageMetricService = chatIdUsageMetricService;
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
        //await notificationService.NotifyNewMessage(chatId, dbMessage.Id);
        await notificationService.RecieveMessage(chatId, dbMessage);

        chatIdUsageMetricService.AddMetric(chatId);
        foreach (var rankedChatId in chatIdUsageMetricService.rankedChatIds)
        {
            Console.WriteLine($"ChatId: {rankedChatId.Key} - Usage: {rankedChatId.Value}");
        }

        return new ChatMessageDTO(dbMessage);
    }

    public ChatIdUsageMetric[] GetRankedChatIdsAsync(int count)
    {
        return chatIdUsageMetricService.GetRankedChatIds(count).Where(chatId => !string.IsNullOrEmpty(chatId.ChatId)).ToArray();
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
