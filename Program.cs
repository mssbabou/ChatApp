var builder = WebApplication.CreateBuilder(args);

// Add services to the DI container.
// IMPORTANT: This must be done before calling builder.Build()
builder.Services.AddSignalR();

var app = builder.Build();

// Now that the WebApplication instance is created, configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

// Map the SignalR Hub
app.MapHub<ChatHub>("/chathub");

MongoDbContext dbContext = new MongoDbContext(builder.Configuration);
ChatDatabaseService chatDatabaseService = new ChatDatabaseService(dbContext);
await chatDatabaseService.AddMessageAsync(new ChatMessage("user", $"message"));
List<ChatMessage> messages = await chatDatabaseService.GetLastMessages(0, 10);

app.Run();
