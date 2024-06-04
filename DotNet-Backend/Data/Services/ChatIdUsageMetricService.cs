public class ChatIdUsageMetricService
{
    public Dictionary<string, int> rankedChatIds;
    private CircularArray<string> recentChatIds;
    private const int maxChatIds = 1000;

    public ChatIdUsageMetricService()
    {
        recentChatIds = new CircularArray<string>(maxChatIds);
        rankedChatIds = [];
    }

    public void AddMetric(string chatId)
    {
        string removedItem = recentChatIds.Enqueue(chatId ?? "");

        ChangeRank(chatId ?? "", 1);

        if (removedItem != null)
        {
            ChangeRank(removedItem, -1);
        }
    }

    private void ChangeRank(string chatId, int change)
    {
        if (rankedChatIds.ContainsKey(chatId))
        {
            rankedChatIds[chatId] += change;
        }
        else
        {
            rankedChatIds.Add(chatId, change);
        }
    }

    public ChatIdUsageMetric[] GetRankedChatIds(int count)
    {
        return rankedChatIds.OrderByDescending(kvp => kvp.Value).Take(count).Select(kvp => new ChatIdUsageMetric(kvp.Key, kvp.Value)).ToArray();
    }
}

public struct ChatIdUsageMetric
{
    public string ChatId { get; set; }
    public int UsageCount { get; set; }

    public ChatIdUsageMetric(string chatId, int usageCount)
    {
        ChatId = chatId;
        UsageCount = usageCount;
    }
}