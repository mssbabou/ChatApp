public class NameGenerator
{
    public string[] FirstNames;
    public string[] LastNames;
    private static Random random = new Random();

    private readonly ChatDatabaseService chatDatabaseService;

    public NameGenerator(ChatDatabaseService chatDatabaseService)
    {
        this.chatDatabaseService = chatDatabaseService;

        FirstNames = File.ReadAllLines("NameFiles/FirstNames.csv");
        LastNames = File.ReadAllLines("NameFiles/LastNames.csv");
    }

    public string GetRandomName()
    {
        int firstNameIndex = random.Next(0, FirstNames.Length-1);
        int lastNameIndex = random.Next(0, LastNames.Length-1);
        string randomName = FirstNames[firstNameIndex] + " " + LastNames[lastNameIndex];
        return randomName;
    }
    
    public async Task<string> GetRandomUniqueName()
    {
        string randomName = GetRandomName();
        while(await chatDatabaseService.IsNameTaken(randomName))
        {
            randomName = GetRandomName();
        }
        return randomName;
    }
    
}