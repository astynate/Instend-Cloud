using Exider.Core.Models.Account;
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

            //await emailService.SendEmailConfirmation("svyat006@icloud.com", "F5736D", "https://google.com");
            await emailService.SendEmailConfirmation("sicome.a.s@gmail.com", "F5736D", "https://google.com");
            //await emailService.SendEmailConfirmation("andreeva_alesya@inbox.ru", "F5736D", "asdasd");
            //await emailService.SendEmailConfirmation("korolenko.danila1@gmail.com", "F5736D", "asdasd");

        }

        [TestMethod]
        public void TestSendLoginNotification()
        {

            EmailService emailService = new EmailService(new ValidationService());

            //SessionModel sessionModel = new SessionModel()
            //{
            //    Device = "Device",
            //    Browser = "Browser",
            //    CreationTime = DateTime.Now,
            //    EndTime = DateTime.Now,
            //};

            //await emailService.SendLoginNotificationEmail("sicome.a.s@gmail.com", sessionModel);
            //await emailService.SendLoginNotificationEmail("svyat006@icloud.com", sessionModel);

        }

    }

}
