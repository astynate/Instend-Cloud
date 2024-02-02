using Exider.Services.External.EmailService;

namespace Exider.Tests
{

    [TestClass]
    internal class TestEmailService
    {

        [TestMethod]
        public void TestHtmlEncoder()
        {

            string inputHtmlFilePath = "D:\\[1] Exider Projects\\Exider-Version-2.0.0\\Exider.Services\\External\\EmailService\\Emails\\confirm-register.html";
            string outputHtmlFilePath = "D:\\[1] Exider Projects\\Exider-Version-2.0.0\\Exider.Services\\External\\EmailService\\Emails\\confirm-register-min.html";

            HtmlEncoder.EncodeHtmlFromFile(inputHtmlFilePath, outputHtmlFilePath);
            Assert.IsTrue(File.Exists(outputHtmlFilePath));

        }

    }

}
