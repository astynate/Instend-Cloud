using Exider.Core.Models.Account;

namespace Exider.Dependencies.Services
{
    public interface IEmailService
    {
        Task SendEmailConfirmation(string email, string code, string link);
        Task SendLoginNotificationEmail(string email, string link, SessionModel model);
        Task SendPasswordResetEmail(string email, string link, SessionModel model);
    }
}