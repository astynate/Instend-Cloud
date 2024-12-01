using Instend.Core.Models.Account;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Repositories
{
    public class SessionsRepository : ISessionsRepository
    {
        private readonly AccountsContext _context = null!;

        public SessionsRepository(AccountsContext context)
        {
            _context = context;
        }

        public async Task<List<AccountSession>> GetSessionsByUserId(Guid userId)
        {
            return await _context.Sessions
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task<AccountSession?> GetSessionByTokenAndUserId(Guid userId, string token)
        {
            return await _context.Sessions.AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == userId && x.RefreshToken == token);
        }

        public async Task AddSessionAsync(AccountSession session)
        {
            await _context.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    if (session == null)
                    {
                        transaction.Rollback(); return;
                    }

                    List<AccountSession> userSessions = await GetSessionsByUserId(session.UserId);

                    if (userSessions != null && userSessions.Count >= 5)
                    {
                        _context.Sessions.RemoveRange(userSessions[0]);
                        await _context.SaveChangesAsync();
                    }

                    await _context.Sessions.AddAsync(session);
                    await _context.SaveChangesAsync();

                    transaction.Commit();
                }
            });
        }
    }
}
