public class PrivateUserDTO(User user)
{
    public string PublicUserId { get; private set; } = user.PublicUserId;
    public string PrivateUserId { get; private set; } = user.PrivateUserId;
    public string Username { get; private set; } = user.Username;
    public DateTime CreatedAt { get; private set; } = user.CreatedAt;
}