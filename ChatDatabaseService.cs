using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

public class ChatDatabaseService
{
    #region Fields
    public const string ChatMessagesCollectionName = "ChatMessages";

    private readonly IMongoCollection<ChatMessage> chatMessagesCollection;
    #endregion

    #region Constructor
    public ChatDatabaseService(MongoDbContext dbContext)
    {
        chatMessagesCollection = dbContext.GetCollection<ChatMessage>(ChatMessagesCollectionName);
    }
    #endregion

    #region Methods
    public async Task AddMessageAsync(ChatMessage message)
    {
        await chatMessagesCollection.InsertOneAsync(message);
    }

    public async Task<List<ChatMessage>> GetLastMessages(int start, int count) 
    {
        return await chatMessagesCollection.Find(_ => true) // Find all documents
            .SortByDescending(m => m.TimeStamp) // Sort by TimeStamp in descending order
            .Skip(start) // Skip the first 'start' documents
            .Limit(count) // Limit the number of documents returned to 'count'
            .ToListAsync(); // Return the documents as a List
    }
    #endregion
}

public class ChatMessage
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string User { get; set; }
    public string Message { get; set; }
    public DateTime TimeStamp { get; set; }

    public ChatMessage(string user, string message)
    {
        User = user;
        Message = message;
        TimeStamp = DateTime.UtcNow;
    }
}

