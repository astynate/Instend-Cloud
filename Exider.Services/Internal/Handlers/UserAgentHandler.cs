namespace Exider.Services.Internal.Handlers
{
    public class UserAgentHandler : IUserAgentHandler
    {

        public readonly string[] operationSystems = { "Windows", "Linux", "Mac", "Android", "iOS" };

        public string GetUserBrowser(string userAgent)
            => "";

        public string GetUserOperationSystem(string userAgent)
            => operationSystems.First(userAgent.Contains);

    }
}
