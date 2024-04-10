var builder = WebApplication.CreateBuilder(args);

// Add services to the DI container.
builder.Services.AddScoped<MongoDbContext>();
builder.Services.AddScoped<ChatDatabaseService>();
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

_ = Task.Run(async () =>
{
    try
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<MongoDbContext>();
        await dbContext.Database.ListCollectionNamesAsync();

        Console.WriteLine("Connected to MongoDB");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Failed to connect to MongoDB");
    }
});

app.Run();
