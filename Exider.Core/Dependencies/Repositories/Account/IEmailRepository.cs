using Exider.Core.Models.Account;

namespace Exider.Repositories.Account
{
    public interface IEmailRepository
    {
        Task AddAsync(EmailModel emailModel);
        Task<EmailModel> GetAsync(string email);
    }
}