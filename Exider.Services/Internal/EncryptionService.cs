using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;

namespace Exider_Version_2._0._0.ServerApp.Services
{

    public static class EncryptionService
    {

        private static readonly byte[] _key = { 5, 4, 3, 8, 2, 6, 7, 8, 24, 123, 13, 2, 230, 32, 64, 12 };

        public static string HashUsingSHA256(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        public static SymmetricSecurityKey GetSymmetricKey(string key)
            => new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

        public static string GeneratePublicIdFromPrivate(uint id)
        {

            using (Aes aesAlg = Aes.Create())
            {

                aesAlg.Key = _key;
                aesAlg.GenerateIV();

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                byte[] idBytes = BitConverter.GetBytes(id);
                byte[] encryptedIdBytes = encryptor.TransformFinalBlock(idBytes, 0, idBytes.Length);
                byte[] result = new byte[aesAlg.IV.Length + encryptedIdBytes.Length];

                Buffer.BlockCopy(aesAlg.IV, 0, result, 0, aesAlg.IV.Length);
                Buffer.BlockCopy(encryptedIdBytes, 0, result, aesAlg.IV.Length, encryptedIdBytes.Length);

                return Convert.ToBase64String(result);

            }

        }

        public static uint DecryptPublicIdToPrivate(string encryptedId)
        {

            byte[] encryptedBytes = Convert
                .FromBase64String(encryptedId);

            using (Aes aesAlg = Aes.Create())
            {

                aesAlg.Key = _key;

                byte[] iv = new byte[aesAlg.IV.Length];
                byte[] idBytes = new byte[encryptedBytes.Length - aesAlg.IV.Length];

                Buffer.BlockCopy(encryptedBytes, 0, iv, 0, aesAlg.IV.Length);
                Buffer.BlockCopy(encryptedBytes, aesAlg.IV.Length, idBytes, 0, idBytes.Length);

                aesAlg.IV = iv;

                ICryptoTransform decryptor = aesAlg
                    .CreateDecryptor(aesAlg.Key, aesAlg.IV);

                byte[] decryptedIdBytes = decryptor
                    .TransformFinalBlock(idBytes, 0, idBytes.Length);

                return BitConverter.ToUInt32(decryptedIdBytes, 0);

            }

        }

    }

}
