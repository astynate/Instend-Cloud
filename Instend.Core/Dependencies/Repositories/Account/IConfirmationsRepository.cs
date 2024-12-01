using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Core.Models.Email;

namespace Instend.Core.Dependencies.Repositories.Account
{
    public interface IConfirmationsRepository
    {
        Task<Result<AccountConfirmation>> GetByLinkAsync(Guid link);
        Task<Result<AccountConfirmation>> GetByEmailAsync(string email);
        Task<Result<AccountConfirmation>> UpdateByLinkAsync(IEncryptionService enctyptionService, string link);
        Task<Result> AddAsync(AccountConfirmation confirmation);
        Task<Result> DeleteAsync(AccountConfirmation confirmation);
    }
}