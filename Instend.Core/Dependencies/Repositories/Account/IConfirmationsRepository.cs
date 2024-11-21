using CSharpFunctionalExtensions;
using Instend.Core.Models.Email;

namespace Instend.Repositories.Account
{
    public interface IConfirmationsRepository
    {
        Task AddAsync(ConfirmationModel emailModel);
        Task ConfirmEmailAddressAsync(string email);
        Task<Result<ConfirmationModel>> GetByEmailAsync(string email);
    }
}