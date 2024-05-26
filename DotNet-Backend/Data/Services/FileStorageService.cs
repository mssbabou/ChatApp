public abstract class FileStorageService : IFileStorageService
{
    public abstract Task<string> SaveFileAsync(IFormFile file);

    public virtual string GetNewFileName(string fileName)
    {
        return $"{Guid.NewGuid()}_{fileName}".Replace(" ", "_");
    }
}