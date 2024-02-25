using Microsoft.AspNetCore.Http;

namespace Exider.Services.Internal.Handlers
{
    public interface IRequestHandler
    {
        string GetUserId(HttpContext httpContext);
    }
}