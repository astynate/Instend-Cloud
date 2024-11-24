using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Core.Models.Email;

namespace Instend.Core.Dependencies.Repositories.Account
{
    public interface IConfirmationsRepository
    {
        Task<Result<ConfirmationModel>> GetByLinkAsync(Guid link);
        Task<Result<ConfirmationModel>> GetByEmailAsync(string email);
        Task<Result<ConfirmationModel>> UpdateByLinkAsync(IEncryptionService enctyptionService, string link);
        Task<Result> AddAsync(ConfirmationModel confirmation);
        Task<Result> DeleteAsync(ConfirmationModel confirmation);
    }
}