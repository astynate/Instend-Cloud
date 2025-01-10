using CSharpFunctionalExtensions;
using Instend.Core.Models.Account;

namespace Instend.Core.Dependencies.Repositories.Account
{
    public interface IFollowersRepository
    {
        Task<AccountFollower[]> GetFriendsByUserId(Guid userId);
        Task<Result<AccountFollower?>> ChangeFollowingState(Guid accountId, Guid followerId);
    }
}