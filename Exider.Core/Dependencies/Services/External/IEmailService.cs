using Exider.Core.Models.Account;

namespace Exider.Dependencies.Services
{
    public interface IEmailService
    {
        Task SendEmailConfirmation(string email, string code, string link);
        Task SendLoginNotificationEmail(string email, SessionModel model);
        Task SendPasswordResetEmail(string email, SessionModel model);
    }
}