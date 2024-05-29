public class ChatMessageDTO(ChatMessage message)
{
    public string Id { get; } = message.Id.ToString();

    public string PublicUserId { get; } = message.PublicUserId;
    public string UserName { get; } = message.UserName;
    public string Message { get; } = message.Message;
    public DateTime TimeStamp { get; } = message.TimeStamp;
}