using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Services.Internal.Services;
using System.Reflection.Metadata.Ecma335;

namespace Instend.Services.Internal.Handlers
{
    public class RequestHandler : IRequestHandler
    {
        private readonly ITokenService _tokenService;

        public RequestHandler(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        public Result<string> GetUserId(string? authorizationHeader)
        {
            if (string.IsNullOrEmpty(authorizationHeader)) 
            {
                return Result.Failure<string>("Token cannot empthy");
            }

            string token = authorizationHeader.Split(" ").Last();

            if (string.IsNullOrEmpty(token))
            {
                return Result.Failure<string>("Invalid token");
            }

            return _tokenService.GetUserIdFromToken(token) ?? Result.Failure<string>("Invalid token");
        }
    }
}
