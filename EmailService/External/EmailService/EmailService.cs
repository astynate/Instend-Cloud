using System.Net.Mail;
using System.Net;
using Exider_Version_2._0._0.ServerApp.Configuration;
using Exider_Version_2._0._0.ServerApp.Models;
using Exider_Version_2._0._0.ServerApp.Dependencies;
using Exider.Services.Internal;

namespace Exider.Services.Services.EmailService
{

    public class EmailService : IEmailService
    {

        private async Task SendEmailAsync(string email, string template)
        {

            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentNullException(nameof(email));
            }

            if (string.IsNullOrEmpty(template))
            {
                throw new ArgumentException(nameof(template));
            }

            MailAddress sender = new MailAddress(Options.corporateEmail, "Exider");
            MailAddress recipient = new MailAddress(ValidationService.ValidateEmail(email));
            MailMessage mail = new MailMessage(sender, recipient);

            mail.Subject = "Please confirm your email address";
            mail.Body = template;
            mail.IsBodyHtml = true;

            SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);

            smtp.Credentials = new NetworkCredential(Options.corporateEmail, Options.corporatePassword);
            smtp.EnableSsl = true;

            await smtp.SendMailAsync(mail);

        }

        public async Task SendEmailConfirmation(string email, string nickname, string code)
        {

            string template = "";

            await SendEmailAsync(email, template);

        }

        public async Task SendPasswordResetEmail(string email, string link, SessionModel model)
        {
            throw new NotImplementedException();
        }

        public async Task SendLoginNotificationEmail(string email, string link, SessionModel model)
        {
            throw new NotImplementedException();
        }

    }

}
