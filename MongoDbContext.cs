using MongoDB.Driver;

public class MongoDbContext
{
    public IMongoDatabase Database;

    public MongoDbContext(IConfiguration configuration)
    {
        var connectionString = configuration.GetValue<string>("MongoDB:ConnectionString");
        var databaseName = configuration.GetValue<string>("MongoDB:DatabaseName");
        var client = new MongoClient(connectionString);
        Database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<T> GetCollection<T>(string name)
    {
        return Database.GetCollection<T>(name);
    }

    public async Task<bool> TestConnectionAsync()
    {
        try
        {
            await Database.ListCollectionNamesAsync();
            Console.WriteLine("Connected to MongoDB");
            return true;
        }
        catch (Exception)
        {
            Console.WriteLine("Failed to connect to MongoDB");
            return false;
        }
    }
}