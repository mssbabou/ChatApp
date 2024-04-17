using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }

    public string PublicUserId { get; private set; }
    public string PrivateUserId { get; private set; }
    public string Username { get; set; }
    public DateTime CreatedAt { get; private set; }
    
    public User(string username)
    {
        Username = username;

        PublicUserId = Guid.NewGuid().ToString();
        PrivateUserId = Guid.NewGuid().ToString();
        CreatedAt = DateTime.UtcNow;
    }
}

public class PublicUserView
{
    public string PublicUserId { get; set; }
    public string Username { get; set; }

    public PublicUserView(User user)
    {
        PublicUserId = user.PublicUserId;
        Username = user.Username;
    }
}

public class PrivateUserView
{
    public string PublicUserId { get; set; }
    public string PrivateUserId { get; set; }
    public string Username { get; set; }
    public DateTime CreatedAt { get; set; }

    public PrivateUserView(User user)
    {
        PublicUserId = user.PublicUserId;
        PrivateUserId = user.PrivateUserId;
        Username = user.Username;
        CreatedAt = user.CreatedAt;
    }
}