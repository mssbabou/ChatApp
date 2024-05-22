using Azure.Storage.Blobs;

public class AzureFileStorage : IFileStorageService
{
    private readonly string connectionString = "";
    private readonly string containerName = "";

    public AzureFileStorage(IConfiguration configuration)
    {
        connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING") ?? configuration.GetValue<string>("AzureStorage:ConnectionString");
        containerName = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONTAINER_NAME") ?? configuration.GetValue<string>("AzureStorage:ContainerName");
    }

    public async Task<string> SaveFileAsync(IFormFile file)
    {
        var blobServiceClient = new BlobServiceClient(connectionString);
        var blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = blobContainerClient.GetBlobClient(file.FileName);

        using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, true);
        }

        return blobClient.Uri.ToString();
    }
}