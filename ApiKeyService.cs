public interface IApiKeyService
{
    Task<bool> ValidateApiKeyAsync(string apiKey);
}

public class ApiKeyService : IApiKeyService
{
    private const string tempApiKey = "1234";

    public Task<bool> ValidateApiKeyAsync(string apiKey)
    {
        return Task.FromResult(apiKey == tempApiKey);
    }
}