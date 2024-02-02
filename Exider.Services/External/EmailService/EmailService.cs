using System.Net.Mail;
using System.Net;
using Exider.Dependencies.Services;
using Exider.Core;
using Exider.Core.Models;

namespace Exider_Version_2._0._0.ServerApp.Services
{

    public class EmailService : IEmailService
    {

        private async Task SendEmailAsync(string email, string template)
        {

            if (ValidationService.ValidateEmail(email) == false)
            {
                throw new ArgumentNullException(nameof(email));
            }

            if (string.IsNullOrEmpty(template))
            {
                throw new ArgumentException(nameof(template));
            }

            MailAddress sender = new MailAddress(Configuration.corporateEmail, "Exider");
            MailAddress recipient = new MailAddress(email);
            MailMessage mail = new MailMessage(sender, recipient);

            mail.Subject = "Please confirm your email address";
            mail.Body = template;
            mail.IsBodyHtml = true;

            SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);

            smtp.Credentials = new NetworkCredential(Configuration.corporateEmail, Configuration.corporatePassword);
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
