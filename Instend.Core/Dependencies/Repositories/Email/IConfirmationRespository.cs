using CSharpFunctionalExtensions;
using Exider.Core.Models.Email;
using Exider_Version_2._0._0.ServerApp.Services;

namespace Exider.Repositories.Email
{
    public interface IConfirmationRespository
    {
        Task <Result<ConfirmationModel>> GetByLinkAsync(string link);
        Task <Result<ConfirmationModel>> GetByEmailAsync(string email);
        Task<Result<ConfirmationModel>> UpdateByLinkAsync(IEncryptionService enctyptionService, string link);
        Task AddAsync(ConfirmationModel confirmation);
        Task<Result> DeleteAsync(ConfirmationModel confirmation);
    }
}