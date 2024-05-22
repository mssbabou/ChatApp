using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class ChatMessage(PublicUserDTO publicUserView, string chatId,  string message)
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id { get; private set; }

    public string ChatId { get; private set; } = chatId;
    public string PublicUserId { get; private set; } = publicUserView.PublicUserId;
    public string UserName { get; set; } = publicUserView.Username;
    public string Message { get; private set; } = message;
    public DateTime TimeStamp { get; private set; } = DateTime.UtcNow;
}