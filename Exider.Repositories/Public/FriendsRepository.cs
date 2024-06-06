using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Public;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Public
{
    public class FriendsRepository : IFriendsRepository
    {
        private readonly DatabaseContext _context = null!;

        public FriendsRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<FriendModel[]> GetFriendsByUserId(Guid userId)
        {
            return await _context.Friends.AsNoTracking()
                .Where(x => x.UserId == userId || x.OwnerId == userId)
                .ToArrayAsync();
        }

        public async Task<Result<FriendModel>> SendRequestAsync(Guid userId, Guid ownerId)
        {
            var friend = FriendModel.Create(userId, ownerId);

            if (friend.IsFailure)
            {
                return Result.Failure<FriendModel>(friend.Error);
            }

            await _context.AddAsync(friend.Value);
            await _context.SaveChangesAsync();

            return friend.Value;
        }
    }
}