using Exider_Version_2._0._0.ServerApp.Configuration;
using Exider_Version_2._0._0.ServerApp.Models;
using Microsoft.EntityFrameworkCore;

namespace Exider_Version_2._0._0.ServerApp.Repositories
{
    public class SessionRepository
    {

        private readonly DatabaseContext _context = null!;

        public SessionRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<List<SessionModel>> GetSessionsByUserId(uint userId)
        {

            List<SessionModel> sessions = await _context.Sessions
                .Where(x => x._userId == userId)
                .ToListAsync();

            if (sessions == null)
            {
                throw new ArgumentException(nameof(SessionModel));
            }

            return sessions;

        }


        public async Task<SessionModel> GetSessionByTokenAndUserId(uint userId, string token)
        {

            return await _context.Sessions
                .FirstOrDefaultAsync(x => x._userId == userId && x._refreshToken == token)
                    ?? throw new ArgumentException(typeof(SessionModel).ToString());

        }

        public async Task AddSessionAsync(SessionModel session)
        {

            if (session == null)
            {
                throw new ArgumentNullException(nameof(session));
            }

            List<SessionModel> userSessions = await GetSessionsByUserId(session._userId);

            if (userSessions != null && userSessions.Count >= 5) 
            {
                _context.Sessions.RemoveRange(userSessions[0]);
                await _context.SaveChangesAsync();
            }

            await _context.Sessions.AddAsync(session);
            await _context.SaveChangesAsync();

        }

    }

}
