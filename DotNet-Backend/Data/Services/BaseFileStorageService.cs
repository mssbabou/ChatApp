public abstract class BaseFileStorageService : IFileStorageService
{
    public abstract Task<string> SaveFileAsync(IFormFile file);

    public virtual string GetNewFileName(string fileName)
    {
        const int maxNameSize = 20;
        int start = fileName.Length - maxNameSize < 0 ? 0 : fileName.Length - maxNameSize;
        int length = fileName.Length - start > fileName.Length ? fileName.Length : fileName.Length - start;
        string newFileName = fileName.Substring(start, length);
        return $"{Guid.NewGuid()}_{newFileName}".Replace(" ", "_");
    }
}