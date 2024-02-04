using Exider.Core;
using Exider.Core.Models.Account;
using Microsoft.EntityFrameworkCore;
using System.Transactions;

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

            List<SessionModel> sessions = await _context.Sessions
                .Where(x => x.UserId == userId)
                .ToListAsync();

            if (sessions == null)
            {
                throw new ArgumentException(nameof(SessionModel));
            }

            return sessions;

        }

        public async Task<SessionModel> GetSessionByTokenAndUserId(Guid userId, string token)
        {

            return await _context.Sessions
                .FirstOrDefaultAsync(x => x.UserId == userId && x.RefreshToken == token)
                    ?? throw new ArgumentException(typeof(SessionModel).ToString());

        }

        public async Task AddSessionAsync(SessionModel session)
        {

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {

                if (session == null)
                {
                    throw new ArgumentNullException(nameof(session));
                }

                List<SessionModel> userSessions = await GetSessionsByUserId(session.UserId);

                if (userSessions != null && userSessions.Count >= 5)
                {
                    _context.Sessions.RemoveRange(userSessions[0]);
                    await _context.SaveChangesAsync();
                }

                await _context.Sessions.AddAsync(session);
                await _context.SaveChangesAsync();

                scope.Complete();

            }

        }

    }

}
