public class NameGenerator(ChatDatabaseService chatDatabaseService)
{
    #region Fields
    public string[] FirstNames = File.ReadAllLines("Namefiles/FirstNames.csv");
    public string[] LastNames = File.ReadAllLines("Namefiles/LastNames.csv");
    private readonly Random random = new Random();
    private readonly ChatDatabaseService chatDatabaseService = chatDatabaseService;

    #endregion

    #region Methods
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
    #endregion
}