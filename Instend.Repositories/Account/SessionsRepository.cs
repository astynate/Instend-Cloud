﻿using Instend.Core.Models.Account;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Repositories
{
    public class SessionsRepository : ISessionsRepository
    {
        private readonly GlobalContext _context = null!;

        public SessionsRepository(GlobalContext context)
        {
            _context = context;
        }

        public async Task<List<AccountSession>> GetSessionsByUserId(Guid accountId)
        {
            return await _context.Sessions
                .Where(x => x.AccountId == accountId)
                .ToListAsync();
        }

        public async Task<AccountSession?> GetSessionByTokenAndUserId(Guid userId, string token)
        {
            return await _context.Sessions.AsNoTracking()
                .FirstOrDefaultAsync(x => x.AccountId == userId && x.RefreshToken == token);
        }

        public async Task AddSessionAsync(AccountSession session)
        {
            await _context.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    if (session == null)
                    {
                        transaction.Rollback(); 
                        return;
                    }

                    var userSessions = await GetSessionsByUserId(session.AccountId);

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