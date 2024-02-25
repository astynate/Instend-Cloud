using Exider.Dependencies.Services;
using Microsoft.AspNetCore.Http;

namespace Exider.Services.Internal.Handlers
{
    public class RequestHandler : IRequestHandler
    {
        private readonly ITokenService _tokenService;

        public RequestHandler(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        public string GetUserId(HttpContext httpContext)
        {
            string? token = httpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            return _tokenService.GetUserIdFromToken(token);
        }
    }
}
