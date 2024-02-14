using CSharpFunctionalExtensions;
using Exider.Core.Models.Email;

namespace Exider.Repositories.Email
{
    public interface IConfirmationRespository
    {
        Task <Result<ConfirmationModel>> GetByLinkAsync(string link);
        Task AddAsync(ConfirmationModel confirmation);
        Task<Result> DeleteAsync(ConfirmationModel confirmation);
    }
}