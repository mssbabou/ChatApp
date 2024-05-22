public class ChatMessageDTO(ChatMessage message)
{
    public string Id { get; set; } = message.Id.ToString();

    public string PublicUserId { get; set; } = message.PublicUserId;
    public string UserName { get; set; } = message.UserName;
    public string Message { get; set; } = message.Message;
    public DateTime TimeStamp { get; set; } = message.TimeStamp;
}