using Instend.Core.Models.Account;

namespace Instend.Dependencies.Services
{
    public interface IEmailService
    {
        Task SendEmailConfirmation(string email, string code, string link);
        Task SendLoginNotificationEmail(string email, AccountSession model);
        Task SendPasswordRecoveryEmail(string email, string code, string link);
    }
}