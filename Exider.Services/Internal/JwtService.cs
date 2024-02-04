using Exider.Dependencies.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Exider_Version_2._0._0.ServerApp.Services
{
    public class JwtService : ITokenService
    {

        private readonly IEncryptionService _encryptionService;

        public JwtService(IEncryptionService encryptionService)
        {
            _encryptionService = encryptionService;
        }

        public string GenerateAccessToken(string id, int time, string key)
        {

            var claims = new List<Claim> { new Claim("sub", id) };

            var jwt = new JwtSecurityToken(

                issuer: "Exider Company",
                audience: "User",
                claims: claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromDays(time)),
                signingCredentials: new SigningCredentials(_encryptionService.GetSymmetricKey(key), SecurityAlgorithms.HmacSha256)

            );

            return new JwtSecurityTokenHandler().WriteToken(jwt);

        }

        public string GenerateRefreshToken(string id)
        {

            Random random = new Random();

            string refreshToken = new string(Enumerable.Range(0, 50)
                .Select(_ => (char)random.Next(48, 123)).Where(char.IsLetterOrDigit).ToArray());

            return id + refreshToken;

        }

    }

}
