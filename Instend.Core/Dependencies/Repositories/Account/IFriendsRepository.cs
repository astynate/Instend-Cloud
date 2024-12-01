using CSharpFunctionalExtensions;
using Instend.Core.Models.Account;

namespace Instend.Core.Dependencies.Repositories.Account
{
    public interface IFriendsRepository
    {
        Task<AccountFollower[]> GetFriendsByUserId(Guid userId);
        Task<Result<AccountFollower>> SendRequestAsync(Guid userId, Guid ownerId);
        Task<bool> SubmitRequestAsync(Guid userId, Guid friendId);
    }
}