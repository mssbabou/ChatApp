public class PublicUserDTO(User user)
{
    public string PublicUserId { get; private set; } = user.PublicUserId;
    public string Username { get; private set; } = user.Username;
}