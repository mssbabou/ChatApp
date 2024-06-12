using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

#region Development Configuration
// Configure CORS only for development environment
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("LocalCorsPolicy", policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Allow only the local development frontend origin
                  .AllowCredentials()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });
}
#endregion

#region Service Configuration
// Dependency injections for services
builder.Services.AddScoped<IApiKeyService, ApiKeyService>();
builder.Services.AddScoped<IFileStorageService, AzureFileStorage>();
builder.Services.AddSingleton<MongoDBContext>();
builder.Services.AddSingleton<ChatDatabaseService>();
builder.Services.AddScoped<ChatService>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddScoped<NameGenerator>();
builder.Services.AddSingleton<ChatIdUsageMetricService>();
#endregion

#region Authentication
// Set up the API authentication using a custom API key scheme
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "ApiKey";
    options.DefaultChallengeScheme = "ApiKey";
}).AddScheme<AuthenticationSchemeOptions, ApiKeyAuthenticationHandler>("ApiKey", null);
#endregion

#region Controllers and SignalR
// Enable controllers and SignalR for API and real-time communication
builder.Services.AddControllers();
builder.Services.AddSignalR();
#endregion

#region Swagger Configuration
// Swagger/OpenAPI configuration for API documentation and testing
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ChatApp API", Version = "v1" });
    c.AddSecurityDefinition("BearerAuth", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Input your Bearer token in this format - Bearer {your token here}"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "BearerAuth"
                }
            },
            Array.Empty<string>()
        }
    });
});
#endregion

var app = builder.Build();

#region Middleware Configuration
// Configure middleware and HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error"); // Use custom error handler in production
    app.UseHsts(); // HTTP Strict Transport Security in production
}
else
{
    app.UseCors("LocalCorsPolicy"); // Apply CORS policy in development
}

// Static files configuration
var attachmentsPath = Environment.GetEnvironmentVariable("FILESTORAGE_PATH") ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true,
    FileProvider = new PhysicalFileProvider(attachmentsPath),
});
app.UseDefaultFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// Swagger middleware for serving the API documentation
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ChatApp Api V1");
});
#endregion

#region Endpoint Mapping
// Map endpoints
app.MapHub<ChatHub>("/chathub");
app.MapControllers();
#endregion

#region MongoDB Connection Test
// Test MongoDB connection asynchronously on a separate thread
Task testMongoDBConnection = Task.Run(async () =>
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<MongoDBContext>();
    await dbContext.TestConnectionAsync();
});
#endregion

using var scope = app.Services.CreateScope();
var azure = scope.ServiceProvider.GetRequiredService<IFileStorageService>() as AzureFileStorage;

app.Run();
