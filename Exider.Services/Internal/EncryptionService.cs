using Microsoft.IdentityModel.Tokens;
using System;
using System.Security.Cryptography;
using System.Text;

namespace Exider_Version_2._0._0.ServerApp.Services
{

    public class EncryptionService : IEncryptionService
    {

        private readonly byte[] _key = { 5, 4, 3, 8, 2, 6, 7, 8, 24, 123, 13, 2, 230, 32, 64, 12 };

        private readonly string _secretCodeValues = "ABDEFGT123456789";

        private readonly Random _random = new Random();

        public string HashUsingSHA256(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        public SymmetricSecurityKey GetSymmetricKey(string key)
            => new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

        public string GenerateSecretCode(int length)
            => GenerateRandomString(length, _secretCodeValues);

        public string GeneratePublicIdFromPrivate(uint id)
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

        public uint DecryptPublicIdToPrivate(string encryptedId)
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

        public string GenerateRandomString(int length)
        {
            return new string(Enumerable.Range(0, length)
                .Select(_ => (char)_random.Next(48, 123)).ToArray());
        }

        public string GenerateRandomString(int length, string values)
        {
            return new string(Enumerable.Range(0, length)
                .Select(_ => values[_random.Next(0, values.Length)])
                .ToArray());
        }

    }

}
