using MongoDB.Bson;
using MongoDB.Driver;

public class ChatDatabaseService
{
    #region Fields
    public const string ChatMessagesCollectionName = "ChatMessages";
    public const string UsersCollectionName = "Users";

    private readonly IMongoCollection<ChatMessage> chatMessagesCollection;
    private readonly IMongoCollection<User> userCollection;

    private readonly MongoDbContext dbContext;
    #endregion

    #region Constructor
    public ChatDatabaseService(MongoDbContext dbContext)
    {
        this.dbContext = dbContext;

        chatMessagesCollection = dbContext.GetCollection<ChatMessage>(ChatMessagesCollectionName);
        userCollection = dbContext.GetCollection<User>(UsersCollectionName);
    }
    #endregion

    #region Methods
    public async Task<ChatMessage> GetMessageAsync(string id)
    {
        var message = await chatMessagesCollection.Find(m => m.Id == id).FirstOrDefaultAsync();
        if (message == null)
        {
            throw new Exception("Message not found");
        }
        message.User = (await GetUser(message.User)).Username;
        return message;
    }

    public async Task<ChatMessage> AddMessageAsync(ChatMessage message)
    {
        try
        {
            await chatMessagesCollection.InsertOneAsync(message);
            return message;
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to add message", ex);
        }
    }

    public async Task<List<ChatMessage>> GetMessagesDescAsync(int start, int count) 
    {
        var messages = await chatMessagesCollection.Find(_ => true)
            .Skip(start)
            .Limit(count)
            .ToListAsync();
        if (messages == null || messages.Count == 0)
        {
            throw new Exception("No messages found");
        }

        foreach (var message in messages)
        {
            message.User = (await GetUser(message.User)).Username;
        }
        return messages;
    }

    public async Task<bool> VerifyUser(string userId, int minutesToExpire = 0)
    {
        var user = await GetUser(userId);

        if (user == null) return false;

        if (minutesToExpire == 0) return true;

        return user.CreatedAt.AddMinutes(minutesToExpire) > DateTime.UtcNow;
    }

    public async Task<User> GetUser(string userId)
    {
        var user = await userCollection.Find(u => u.UserId == userId).FirstOrDefaultAsync();
        if (user == null)
        {
            throw new Exception("User not found");
        }
        return user;
    }

    public async Task<User> AddUserAsync(User user)
    {
        try
        {
            await userCollection.InsertOneAsync(user);
            return user;
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to add user", ex);
        }
    }

    public async Task CreateFieldIndex(string collection, string fieldName, string type = "")
    {
        var indexKeysDefinition = Builders<BsonDocument>.IndexKeys.Ascending(fieldName);
        var indexModel = new CreateIndexModel<BsonDocument>(indexKeysDefinition);
        await dbContext.GetCollection<BsonDocument>(collection).Indexes.CreateOneAsync(indexModel);
    }
    #endregion
}
