using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Models.Account;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Account
{
    public class FollowersRepository : IFollowersRepository
    {
        private readonly GlobalContext _context = null!;

        public FollowersRepository(GlobalContext context)
        {
            _context = context;
        }

        public async Task<AccountFollower[]> GetFriendsByUserId(Guid userId)
        {
            return await _context.Followers.AsNoTracking()
                .Where(x => x.AccountId == userId || x.FollowerId == userId)
                .ToArrayAsync();
        }

        public async Task<Result<AccountFollower?>> ChangeFollowingState(Guid accountId, Guid followerId)
        {
            var result = await _context.Followers
                .FirstOrDefaultAsync(x => x.AccountId == accountId && x.FollowerId == followerId);

            var account = await _context.Accounts
                .FirstAsync(x => x.Id == accountId);

            var follower = await _context.Accounts
                .FirstAsync(x => x.Id == followerId);

            if (account == null || follower == null || follower.NumberOfFollowingAccounts >= 1000)
                return null;

            if (result != null)
            {
                account.DecrementNumberOfFollowers();
                follower.DecrementNumberOfFollowingAccounts();

                _context.Followers.Remove(result);

                await _context.SaveChangesAsync();

                return null; 
            }

            var friend = new AccountFollower(accountId, followerId);

            account.IncrementNumberOfFollowers();
            follower.IncrementNumberOfFollowingAccounts();

            await _context.AddAsync(friend);
            await _context.SaveChangesAsync();

            return friend;
        }
    }
}