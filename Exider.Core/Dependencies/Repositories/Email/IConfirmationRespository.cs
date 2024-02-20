using CSharpFunctionalExtensions;
using Exider.Core.Models.Email;

namespace Exider.Repositories.Email
{
    public interface IConfirmationRespository
    {
        Task <Result<ConfirmationModel>> GetByLinkAsync(string link);
        Task<Result<ConfirmationModel>> UpdateByLinkAsync(string link);
        Task AddAsync(ConfirmationModel confirmation);
        Task<Result> DeleteAsync(ConfirmationModel confirmation);
    }
}