public interface IApiKeyService
{
    Task<bool> ValidateApiKeyAsync(string apiKey);
}

public class ApiKeyService : IApiKeyService
{
    private readonly ChatDatabaseService chatDatabaseService;

    public ApiKeyService(ChatDatabaseService chatDatabaseService)
    {
        this.chatDatabaseService = chatDatabaseService;
    }

    public Task<bool> ValidateApiKeyAsync(string apiKey)
    {
        return Task.FromResult(chatDatabaseService.VerifyUserPrivateKey(apiKey).Result);
    }
}