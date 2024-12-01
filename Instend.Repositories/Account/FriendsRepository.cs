using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Models.Account;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Account
{
    public class FriendsRepository : IFriendsRepository
    {
        private readonly AccountsContext _context = null!;

        public FriendsRepository(AccountsContext context)
        {
            _context = context;
        }

        public async Task<AccountFollower[]> GetFriendsByUserId(Guid userId)
        {
            return await _context.Friends.AsNoTracking()
                .Where(x => x.AccountModelId == userId || x.OwnerId == userId)
                .ToArrayAsync();
        }

        public async Task<Result<AccountFollower>> SendRequestAsync(Guid userId, Guid ownerId)
        {
            int result = await _context.Friends
                .Where(x => x.AccountModelId == userId && x.OwnerId == ownerId || x.OwnerId == userId && x.AccountModelId == ownerId)
                .ExecuteDeleteAsync();

            if (result != 0)
            {
                await _context.Accounts
                    .Where(x => x.Id == userId || x.Id == ownerId)
                    .ExecuteUpdateAsync(s => s.SetProperty(p => p.FriendCount, p => p.FriendCount - 1 >= 0 ? p.FriendCount - 1 : 0));

                return Result.Failure<AccountFollower>("0");
            }

            var friend = AccountFollower.Create(userId, ownerId);

            if (friend.IsFailure)
            {
                return Result.Failure<AccountFollower>(friend.Error);
            }

            await _context.AddAsync(friend.Value);
            await _context.SaveChangesAsync();

            return friend.Value;
        }

        public async Task<bool> SubmitRequestAsync(Guid userId, Guid friendId)
        {
            int result = await _context.Friends
                .Where(x => x.AccountModelId == userId && x.OwnerId == friendId)
                .ExecuteUpdateAsync(x => x.SetProperty(p => p.IsSubmited, true));

            await _context.Accounts
                .Where(x => x.Id == userId || x.Id == friendId)
                .ExecuteUpdateAsync(x => x.SetProperty(p => p.FriendCount, p => p.FriendCount + 1));

            await _context.SaveChangesAsync();
            return result != 0;
        }
    }
}