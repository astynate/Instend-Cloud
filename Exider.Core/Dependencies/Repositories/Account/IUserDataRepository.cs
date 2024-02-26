using CSharpFunctionalExtensions;
using Exider.Core.Models.Account;
using Exider.Core.TransferModels.Account;

namespace Exider.Repositories.Account
{
    public interface IUserDataRepository
    {
        Task AddAsync(UserDataModel userData);
        Task<Result<UserPublic>> GetUserAsync(Guid id);
    }
}