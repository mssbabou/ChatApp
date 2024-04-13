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
    public async Task<ChatMessage> GetMessageAsync(string id)
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

    public async Task<List<ChatMessage>> GetLastMessagesAsync(int start, int count) 
    {
        var messages = await chatMessagesCollection.Find(_ => true)
            .SortByDescending(m => m.Id)
            .Skip(start)
            .Limit(count)
            .ToListAsync();
        if (messages == null || messages.Count == 0)
        {
            throw new Exception("No messages found");
        }
        return messages;
    }
    #endregion
}
