using MongoDB.Bson;
using MongoDB.Driver;

public class ChatDatabaseService
{
    #region Fields
    public const string ChatMessagesCollectionName = "ChatMessages";
    public const string UsersCollectionName = "Users";

    public readonly IMongoCollection<ChatMessage> chatMessagesCollection;
    public readonly IMongoCollection<User> userCollection;

    private readonly MongoDBContext dbContext;
    #endregion

    #region Constructor
    public ChatDatabaseService(MongoDBContext dbContext)
    {
        this.dbContext = dbContext;

        chatMessagesCollection = dbContext.GetCollection<ChatMessage>(ChatMessagesCollectionName);
        userCollection = dbContext.GetCollection<User>(UsersCollectionName);

        chatMessagesCollection.Indexes.CreateOne(new CreateIndexModel<ChatMessage>(Builders<ChatMessage>.IndexKeys.Descending(m => m.TimeStamp)));
        
        userCollection.Indexes.CreateMany(
        [
            new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(u => u.Username)),
            new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(u => u.PublicUserId)),
            new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(u => u.PrivateUserId))
        ]);
    }
    #endregion

    #region Methods
    public async Task<ChatMessage> GetMessageAsync(ObjectId id)
    {
        var message = await chatMessagesCollection.Find(m => m.Id == id).FirstOrDefaultAsync();
        if (message == null)
        {
            throw new Exception("Message not found");
        }

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

    public async Task<List<ChatMessage>> GetMessagesDescAsync(int skip, int limit)
    {
        var messages = await chatMessagesCollection.Find(_ => true).SortByDescending(m => m.Id).Skip(skip).Limit(limit).ToListAsync();

        if (messages == null)
        {
            throw new Exception("No messages found");
        }

        messages.Reverse();

        return messages;
    }

    public async Task<List<ChatMessage>> GetMessagesBehindAsync(string id, int limit)
    {
        var messages = await chatMessagesCollection.Find(m => m.Id < new ObjectId(id)).SortByDescending(m => m.Id).Limit(limit).ToListAsync();

        if (messages == null)
        {
            throw new Exception("No messages found");
        }

        messages.Reverse();

        return messages;
    }

    public async Task<bool> VerifyUserPrivateKey(string privateUserId, int minutesToExpire = 0)
    {
        var user = await userCollection.Find(u => u.PrivateUserId == privateUserId).FirstOrDefaultAsync();

        if (user == null) return false;

        if (minutesToExpire == 0) return true;

        return user.CreatedAt.AddMinutes(minutesToExpire) > DateTime.UtcNow;
    }

    public async Task<User> GetPublicUserAsync(string publicUserId)
    {
        var user = await userCollection.Find(u => u.PublicUserId == publicUserId).FirstOrDefaultAsync();
        if (user == null)
        {
            throw new Exception("User not found");
        }
        return user;
    }

    public async Task<User> GetPrivateUserAsync(string privateUserId)
    {
        var user = await userCollection.Find(u => u.PrivateUserId == privateUserId).FirstOrDefaultAsync();
        if (user == null)
        {
            throw new Exception("User not found");
        }
        return user;
    }

    public async Task<User> AddUserAsync(string userName)
    {
        try
        {
            var user = new User(userName);
            await userCollection.InsertOneAsync(user);
            return user;
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to add user", ex);
        }
    }

    public async Task<bool> IsNameTaken(string name)
    {
        var user = await userCollection.Find(u => u.Username == name).FirstOrDefaultAsync();
        return user != null;
    }
    #endregion
}
