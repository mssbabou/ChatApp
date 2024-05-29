public class PublicUserDTO(User user)
{
    public string PublicUserId { get; } = user.PublicUserId;
    public string Username { get; } = user.Username;
}