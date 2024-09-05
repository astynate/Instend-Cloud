namespace Exider.Services.Internal.Handlers
{
    public interface IUserAgentHandler
    {
        string GetUserBrowser(string userAgent);
        string GetUserOperationSystem(string userAgent);
    }
}