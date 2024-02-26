using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace Exider.Services.Internal.Handlers
{
    public interface IRequestHandler
    {
        Result<string> GetUserId(string? authorizationHeader);
    }
}