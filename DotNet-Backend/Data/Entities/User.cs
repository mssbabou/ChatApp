using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User(string username)
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId? Id { get; private set; }

    public string PublicUserId { get; private set; } = Guid.NewGuid().ToString();
    public string PrivateUserId { get; private set; } = Guid.NewGuid().ToString();
    public string Username { get; set; } = username;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
}