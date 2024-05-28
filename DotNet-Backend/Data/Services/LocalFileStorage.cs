public class LocalFileStorage : BaseFileStorageService
{
    private readonly string storagePath = string.Empty;

    public LocalFileStorage(IConfiguration configuration)
    {
        storagePath = Environment.GetEnvironmentVariable("FILESTORAGE_PATH") ?? configuration.GetValue<string>("FileStorage:Path")!;
    }

    public override async Task<string> SaveFileAsync(IFormFile file)
    {
        string filePath = Path.Combine(storagePath, GetNewFileName(file.FileName));

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return GetNewFileName(file.FileName);
    }
}