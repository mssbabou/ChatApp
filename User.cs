using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User(string username)
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }

    public string PublicUserId { get; private set; } = Guid.NewGuid().ToString();
    public string PrivateUserId { get; private set; } = Guid.NewGuid().ToString();
    public string Username { get; set; } = username;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
}

public class PublicUserView(User user)
{
    public string PublicUserId { get; private set; } = user.PublicUserId;
    public string Username { get; private set; } = user.Username;
}

public class PrivateUserView(User user)
{
    public string PublicUserId { get; private set; } = user.PublicUserId;
    public string PrivateUserId { get; private set; } = user.PrivateUserId;
    public string Username { get; private set; } = user.Username;
    public DateTime CreatedAt { get; private set; } = user.CreatedAt;
}