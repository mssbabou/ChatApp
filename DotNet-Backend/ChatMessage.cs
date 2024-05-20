using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class ChatMessage(PublicUserView publicUserView, string message)
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id { get; private set; }

    public string PublicUserId { get; private set; } = publicUserView.PublicUserId;
    public string UserName { get; set; } = publicUserView.Username;
    public string Message { get; private set; } = message;
    public DateTime TimeStamp { get; private set; } = DateTime.UtcNow;
}

public class PublicChatMessageView(ChatMessage message)
{
    public string Id { get; set; } = message.Id.ToString();

    public string PublicUserId { get; set; } = message.PublicUserId;
    public string UserName { get; set; } = message.UserName;
    public string Message { get; set; } = message.Message;
    public DateTime TimeStamp { get; set; } = message.TimeStamp;
}