using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

public class AzureFileStorage : FileStorageService
{
    public readonly string connectionString = "";
    public readonly string containerName = "";

    public AzureFileStorage(IConfiguration configuration)
    {
        connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING") ?? configuration.GetValue<string>("AzureStorage:ConnectionString");
        containerName = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONTAINER_NAME") ?? configuration.GetValue<string>("AzureStorage:ContainerName");

        Console.WriteLine($"Connection String: {connectionString}");
        Console.WriteLine($"Container Name: {containerName}");
    }

    public override async Task<string> SaveFileAsync(IFormFile file)
    {
        var blobServiceClient = new BlobServiceClient(connectionString);
        var blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = blobContainerClient.GetBlobClient(GetNewFileName(file.FileName));

        var BlobHttpHeaders = new BlobHttpHeaders
        {
            ContentType = file.ContentType
        };

        using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, new BlobUploadOptions
            {
                HttpHeaders = BlobHttpHeaders
            });
        }

        return blobClient.Uri.ToString();
    }
}