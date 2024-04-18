public class NameGenerator
{
    public static string[] FirstNames = File.ReadAllLines("NameFiles\\FirstNames.csv");
    public static string[] LastNames = File.ReadAllLines("NameFiles\\LastNames.csv");
    private static Random random = new Random();
    public static string GetRandomName()
    {
        int firstNameIndex = random.Next(0, FirstNames.Length-1);
        int lastNameIndex = random.Next(0, LastNames.Length-1);
        string randomName = FirstNames[firstNameIndex] +" "+ LastNames[lastNameIndex];
        return randomName;
    }
        
    
}