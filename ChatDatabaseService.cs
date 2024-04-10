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
        try
        {
            await chatMessagesCollection.InsertOneAsync(message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    public async Task<List<ChatMessage>> GetLastMessages(int start, int count) 
    {
        try
        {
            return await chatMessagesCollection.Find(_ => true) // Find all documents
                .SortByDescending(m => m.TimeStamp) // Sort by TimeStamp in descending order
                .Skip(start) // Skip the first 'start' documents
                .Limit(count) // Limit the number of documents returned to 'count'
                .ToListAsync(); // Return the documents as a List
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return new List<ChatMessage>();
        }
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

