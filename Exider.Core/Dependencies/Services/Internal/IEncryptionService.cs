using Microsoft.IdentityModel.Tokens;

namespace Exider_Version_2._0._0.ServerApp.Services
{
    public interface IEncryptionService
    {
        uint DecryptPublicIdToPrivate(string encryptedId);
        string GeneratePublicIdFromPrivate(uint id);
        SymmetricSecurityKey GetSymmetricKey(string key);
        string HashUsingSHA256(string password);
        string GenerateRandomString(int length);
        string GenerateRandomString(int length, char[] values);
        string GenerateSecretCode(int length);
    }
}