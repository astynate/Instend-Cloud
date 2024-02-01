using Exider_Version_2._0._0.ServerApp.Dependencies;
using Exider_Version_2._0._0.ServerApp.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Exider.Services.Internal
{
    public class JwtService : ITokenService
    {
        public string GenerateAccessToken(UserModel user, int time, string key)
        {

            var claims = new List<Claim> { new Claim("sub", user.PublicId.ToString()) };

            var jwt = new JwtSecurityToken(

                issuer: "Exider Company",
                audience: "User",
                claims: claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromDays(time)),
                signingCredentials: new SigningCredentials(EncryptionService.GetSymmetricKey(key), SecurityAlgorithms.HmacSha256)

            );

            return new JwtSecurityTokenHandler().WriteToken(jwt);

        }

        public string GenerateRefreshToken(UserModel user)
        {

            Random random = new Random();

            string refreshToken = new string(Enumerable.Range(0, 50)
                .Select(_ => (char)random.Next(48, 123)).Where(char.IsLetterOrDigit).ToArray());

            return user.id.ToString() + refreshToken;

        }

    }

}
