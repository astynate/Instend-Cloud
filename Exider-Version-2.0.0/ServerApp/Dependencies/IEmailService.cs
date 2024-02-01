using Exider_Version_2._0._0.ServerApp.Models;

namespace Exider_Version_2._0._0.ServerApp.Dependencies
{
    public interface IEmailService
    {
        Task SendEmailConfirmation(string email, string nickname, string code);
        Task SendLoginNotificationEmail(string email, string link, SessionModel model);
        Task SendPasswordResetEmail(string email, string link, SessionModel model);
    }
}