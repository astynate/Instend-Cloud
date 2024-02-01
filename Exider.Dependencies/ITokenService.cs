using Exider_Version_2._0._0.ServerApp.Models;

namespace Exider_Version_2._0._0.ServerApp.Dependencies
{
    public interface ITokenService
    {
        string GenerateAccessToken(UserModel user, int time, string key);
        string GenerateRefreshToken(UserModel user);
    }
}