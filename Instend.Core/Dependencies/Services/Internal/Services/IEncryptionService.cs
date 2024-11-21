using Microsoft.IdentityModel.Tokens;

namespace Instend.Core.Dependencies.Services.Internal.Services
{
    public interface IEncryptionService
    {
        uint DecryptPublicIdToPrivate(string encryptedId);
        string GeneratePublicIdFromPrivate(uint id);
        SymmetricSecurityKey GetSymmetricKey(string key);
        string HashUsingSHA256(string password);
        string GenerateRandomString(int length);
        string GenerateRandomString(int length, string values);
        string GenerateSecretCode(int length);
    }
}