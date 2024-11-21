using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace Instend.Services.Internal.Handlers
{
    public interface IRequestHandler
    {
        Result<string> GetUserId(string? authorizationHeader);
    }
}