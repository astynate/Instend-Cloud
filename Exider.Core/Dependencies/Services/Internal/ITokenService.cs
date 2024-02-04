using Exider.Core.Models;

namespace Exider.Dependencies.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(string id, int time, string key);
        string GenerateRefreshToken(string id);
    }
}