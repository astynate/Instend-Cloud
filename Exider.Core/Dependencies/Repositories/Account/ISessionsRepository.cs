using Exider.Core.Models.Account;

namespace Exider.Repositories.Repositories
{
    public interface ISessionsRepository
    {
        Task AddSessionAsync(SessionModel session);
        Task<SessionModel?> GetSessionByTokenAndUserId(Guid userId, string token);
        Task<List<SessionModel>> GetSessionsByUserId(Guid userId);
    }
}