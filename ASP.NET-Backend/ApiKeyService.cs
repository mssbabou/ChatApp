public interface IApiKeyService
{
    Task<bool> ValidateApiKeyAsync(string apiKey);
    string GetApiKey(HttpContext httpContext);
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

    public string GetApiKey(HttpContext httpContext)
    {
        if (httpContext.Request.Headers.TryGetValue("Authorization", out var authorizationHeaderValues))
        {
            return authorizationHeaderValues.FirstOrDefault()!["Bearer ".Length..].Trim();
        }

        return null;
    }
}