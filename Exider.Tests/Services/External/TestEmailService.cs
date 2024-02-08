using Exider.Services.External.EmailService;
using Exider_Version_2._0._0.ServerApp.Services;

namespace Exider.Tests.Services.External
{

    [TestClass]
    public class TestEmailService
    {

        [TestMethod]
        public async Task TestSendEmailConfirmation()
        {

            EmailService emailService = new EmailService(new ValidationService());

            await emailService.SendEmailConfirmation("svyat006@icloud.com", "F5736D", "https://google.com");
            await emailService.SendEmailConfirmation("sicome.a.s@gmail.com", "F5736D", "https://google.com");
            //await emailService.SendEmailConfirmation("andreeva_alesya@inbox.ru", "F5736D", "asdasd");
            //await emailService.SendEmailConfirmation("korolenko.danila1@gmail.com", "F5736D", "asdasd");

        }

    }

}
