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
            int result = await _context.Friends
                .Where(x => (x.UserId == userId && x.OwnerId == ownerId) || (x.OwnerId == userId && x.UserId == ownerId))
                .ExecuteDeleteAsync();

            if (result != 0) 
            {
                await _context.UserData
                    .Where(x => (x.UserId == userId || x.UserId == ownerId))
                    .ExecuteUpdateAsync(s => s.SetProperty(p => p.FriendCount, p => p.FriendCount - 1 >= 0 ? p.FriendCount - 1 : 0));

                return Result.Failure<FriendModel>("0");
            }

            var friend = FriendModel.Create(userId, ownerId);

            if (friend.IsFailure)
            {
                return Result.Failure<FriendModel>(friend.Error);
            }

            await _context.AddAsync(friend.Value);
            await _context.SaveChangesAsync();

            return friend.Value;
        }

        public async Task<bool> SubmitRequestAsync(Guid userId, Guid friendId)
        {
            int result = await _context.Friends
                .Where(x => x.UserId == userId && x.OwnerId == friendId)
                .ExecuteUpdateAsync(x => x.SetProperty(p => p.IsSubmited, true));

            await _context.UserData
                .Where(x => x.UserId == userId || x.UserId == friendId)
                .ExecuteUpdateAsync(x => x.SetProperty(p => p.FriendCount, p => p.FriendCount + 1));

            await _context.SaveChangesAsync();
            return result != 0;
        }
    }
}