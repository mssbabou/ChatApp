var builder = WebApplication.CreateBuilder(args);

// Add services to the DI container.
// IMPORTANT: This must be done before calling builder.Build()
builder.Services.AddSignalR();
builder.Services.AddSingleton<MongoDbContext>();

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

Task.Run(() =>
{
    using var scope = app.Services.CreateScope();
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<MongoDbContext>();
        var client = dbContext.Database.Client;
        client.ListDatabaseNames(); // This will throw an exception if unable to connect
        Console.WriteLine("Successfully connected to MongoDB.");
    }
    catch (Exception)
    {
        Console.WriteLine($"Could not connect to MongoDB");
        // Consider logging the exception and handling it appropriately
        // You might want to stop application startup if this is a critical issue
    }
});

app.Run();
