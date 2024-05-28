using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

public class AzureFileStorage : BaseFileStorageService
{
    public readonly string connectionString = string.Empty;
    public readonly string containerName = string.Empty;

    private readonly BlobContainerClient blobContainerClient;

    public AzureFileStorage(IConfiguration configuration)
    {
        connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING") ?? configuration.GetValue<string>("AzureStorage:ConnectionString");
        containerName = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONTAINER_NAME") ?? configuration.GetValue<string>("AzureStorage:ContainerName");

        var blobServiceClient = new BlobServiceClient(connectionString);
        blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);

        Console.WriteLine($"Connection String: {connectionString}");
        Console.WriteLine($"Container Name: {containerName}");
    }

    public override async Task<string> SaveFileAsync(IFormFile file)
    {
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