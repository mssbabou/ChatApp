using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; private set; }

    public string UserId { get; private set; }
    public string Username { get; set; }
    
    public User(string username)
    {
        Username = username;

        UserId = Guid.NewGuid().ToString();
    }
}