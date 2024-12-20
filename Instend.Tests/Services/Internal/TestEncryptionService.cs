﻿using Instend.Core.Dependencies.Services.Internal.Services;
using Instend_Version_2._0._0.ServerApp.Services;

namespace Instend.Tests.Services.Internal
{
    [TestClass]
    public class TestEncryptionService
    {

        private readonly IEncryptionService _encryptionService = new EncryptionService();

        [TestMethod]
        public void TestGetRandomString()
        {

            string secretCode = _encryptionService.GenerateSecretCode(6);

            Console.WriteLine(secretCode);
            Assert.IsInstanceOfType(secretCode, typeof(string));

        }

    }

}
