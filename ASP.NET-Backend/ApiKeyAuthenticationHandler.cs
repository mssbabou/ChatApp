using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

public class ApiKeyAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    #region Fields
    public static string ApiKeyHeaderName = "X-Api-Key";
    public static string AuthorizationHeader = "Authorization";
    private readonly IApiKeyService apiKeyService;
    #endregion

    #region Constructor
    public ApiKeyAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        IApiKeyService apiKeyService)
        : base(options, logger, encoder)
    {
        this.apiKeyService = apiKeyService;
    }
    #endregion

    #region Methods
    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        string providedApiKey;

        if (Request.Headers.TryGetValue(AuthorizationHeader, out var authorizationHeaderValues))
        {
            var bearerToken = authorizationHeaderValues.FirstOrDefault();
            if (string.IsNullOrWhiteSpace(bearerToken))
            {
                return AuthenticateResult.NoResult();
            }

            providedApiKey = bearerToken["Bearer ".Length..].Trim();
        }
        else if (Request.Headers.TryGetValue(ApiKeyHeaderName, out var apiKeyHeaderValues))
        {
            providedApiKey = apiKeyHeaderValues.FirstOrDefault();
        }
        else
        {
            return AuthenticateResult.NoResult();
        }

        if (string.IsNullOrWhiteSpace(providedApiKey))
        {
            return AuthenticateResult.NoResult();
        }

        var isValidApiKey = await apiKeyService.ValidateApiKeyAsync(providedApiKey);

        if (!isValidApiKey)
        {
            return AuthenticateResult.Fail("Invalid API Key");
        }

        var claims = new[] { new Claim(ClaimTypes.Name, "providedApiKey") };
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
    #endregion
}