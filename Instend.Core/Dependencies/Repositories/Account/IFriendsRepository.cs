using CSharpFunctionalExtensions;
using Instend.Core.Models.Public;

namespace Instend.Core.Dependencies.Repositories.Account
{
    public interface IFriendsRepository
    {
        Task<FriendModel[]> GetFriendsByUserId(Guid userId);
        Task<Result<FriendModel>> SendRequestAsync(Guid userId, Guid ownerId);
        Task<bool> SubmitRequestAsync(Guid userId, Guid friendId);
    }
}