using CSharpFunctionalExtensions;
using Exider.Core.Models.Account;
using Exider.Core.TransferModels.Account;

namespace Exider.Repositories.Account
{
    public interface IUserDataRepository
    {
        Task AddAsync(UserDataModel userData);
        Task<Result<UserDataModel>> DecreaseOccupiedSpace(Guid userId, double amountInBytes);
        Task<UserPublic[]> GetPopularPeople();
        Task<Result<UserPublic>> GetUserAsync(Guid id);
        Task<UserPublic[]> GetUsersByPrefixAsync(string prefix);
        Task<Result<UserDataModel>> IncreaseOccupiedSpace(Guid userId, double amountInBytes);
        Task UpdateAvatarAsync(Guid userId, string avatarPath);
        Task UpdateHeaderAsync(Guid userId, string headerPath);
    }
}