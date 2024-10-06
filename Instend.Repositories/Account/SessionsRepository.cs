using Exider.Core;
using Exider.Core.Models.Account;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Repositories
{
    public class SessionsRepository : ISessionsRepository
    {
        private readonly DatabaseContext _context = null!;

        public SessionsRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<List<SessionModel>> GetSessionsByUserId(Guid userId)
        {
            return await _context.Sessions
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task<SessionModel?> GetSessionByTokenAndUserId(Guid userId, string token)
        {
            return await _context.Sessions.AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == userId && x.RefreshToken == token);
        }

        public async Task AddSessionAsync(SessionModel session)
        {
            await _context.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    if (session == null)
                    {
                        transaction.Rollback(); return;
                    }

                    List<SessionModel> userSessions = await GetSessionsByUserId(session.UserId);

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
