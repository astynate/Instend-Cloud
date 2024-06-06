using CSharpFunctionalExtensions;
using Exider.Core.Models.Public;

namespace Exider.Repositories.Public
{
    public interface IFriendsRepository
    {
        Task<FriendModel[]> GetFriendsByUserId(Guid userId);
        Task<Result<FriendModel>> SendRequestAsync(Guid userId, Guid ownerId);
    }
}