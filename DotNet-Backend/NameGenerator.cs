public class NameGenerator
{
    #region Fields
    public string[] FirstNames;
    public string[] LastNames;
    private readonly Random random = new Random();
    private readonly ChatDatabaseService chatDatabaseService;
    #endregion

    #region Constructor
    public NameGenerator(ChatDatabaseService chatDatabaseService)
    {
        this.chatDatabaseService = chatDatabaseService;

        FirstNames = File.ReadAllLines("Namefiles/FirstNames.csv");
        LastNames = File.ReadAllLines("Namefiles/LastNames.csv");
    }
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