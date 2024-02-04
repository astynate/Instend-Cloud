using Exider.Core.Models.Account;

namespace Exider.Repositories.Account
{
    public interface IEmailRepository
    {
        Task AddEmailAsync(EmailModel emailModel);
        Task<EmailModel> GetEmailModelAsync(string email);
    }
}