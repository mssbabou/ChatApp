public class FileStorage
{
    private readonly string storagePath = "";

    public FileStorage(IConfiguration configuration)
    {
        storagePath = Environment.GetEnvironmentVariable("FILESTORAGE_PATH") ?? configuration.GetValue<string>("FileStorage:Path");
    }

    public async Task<string> SaveFileAsync(IFormFile file)
    {
        string fileName = $"{Guid.NewGuid()}_{file.FileName}";
        fileName = fileName.Replace(" ", "_");
        string filePath = Path.Combine(storagePath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return fileName;
    }
}