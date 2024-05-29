public class PrivateUserDTO(User user)
{
    public string PublicUserId { get; } = user.PublicUserId;
    public string PrivateUserId { get; } = user.PrivateUserId;
    public string Username { get; } = user.Username;
    public DateTime CreatedAt { get; } = user.CreatedAt;
}