using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class ChatMessage
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }

    public string UserName { get; set; }
    public string Message { get; private set; }
    public DateTime TimeStamp { get; private set; }

    public ChatMessage(string user, string message)
    {
        UserName = user;
        Message = message;
        TimeStamp = DateTime.UtcNow;
    }
}