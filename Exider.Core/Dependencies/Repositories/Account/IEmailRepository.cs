using Exider.Core.Models.Account;

namespace Exider.Repositories.Account
{
    public interface IEmailRepository
    {
        Task AddAsync(EmailModel emailModel);
        Task ConfirmEmailAddressAsync(string email);
        Task<EmailModel> GetAsync(string email);
    }
}