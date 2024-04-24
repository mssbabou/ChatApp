public class ApiKeyService : IApiKeyService
{
    #region Fields
    private readonly ChatDatabaseService chatDatabaseService;
    #endregion

    #region Constructor
    public ApiKeyService(ChatDatabaseService chatDatabaseService)
    {
        this.chatDatabaseService = chatDatabaseService;
    }
    #endregion

    #region Methods
    public Task<bool> ValidateApiKeyAsync(string apiKey)
    {
        return Task.FromResult(chatDatabaseService.VerifyUserPrivateKey(apiKey).Result);
    }

    public string GetApiKey(HttpContext httpContext)
    {
        if (httpContext.Request.Headers.TryGetValue(ApiKeyAuthenticationHandler.AuthorizationHeader, out var authorizationHeaderValues))
        {
            return authorizationHeaderValues.FirstOrDefault()!["Bearer ".Length..].Trim();
        }
        else if (httpContext.Request.Headers.TryGetValue(ApiKeyAuthenticationHandler.ApiKeyHeaderName, out var apiKeyHeaderValues))
        {
            return apiKeyHeaderValues.FirstOrDefault();
        }

        return null;
    }
    #endregion
}

public interface IApiKeyService
{
    Task<bool> ValidateApiKeyAsync(string apiKey);
    string GetApiKey(HttpContext httpContext);
}
