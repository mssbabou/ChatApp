using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class ChatMessage(PublicUserView publicUserView, string message)
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }

    public string PublicUserId { get; private set; } = publicUserView.PublicUserId;
    public string UserName { get; set; } = publicUserView.Username;
    public string Message { get; private set; } = message;
    public DateTime TimeStamp { get; private set; } = DateTime.UtcNow;
}