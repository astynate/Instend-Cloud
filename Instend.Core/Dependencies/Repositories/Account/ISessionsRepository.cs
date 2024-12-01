using Instend.Core.Models.Account;

namespace Instend.Repositories.Repositories
{
    public interface ISessionsRepository
    {
        Task AddSessionAsync(AccountSession session);
        Task<AccountSession?> GetSessionByTokenAndUserId(Guid userId, string token);
        Task<List<AccountSession>> GetSessionsByUserId(Guid userId);
    }
}