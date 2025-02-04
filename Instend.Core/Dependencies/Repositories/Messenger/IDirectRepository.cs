using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Messenger;
using Instend.Core.Models.Messenger.Direct;

namespace Instend.Repositories.Messenger
{
    public interface IDirectRepository : IChatBase
    {
        Task<Result<Direct>> CreateNewDirect(Guid userId, Guid ownerId);
        Task<bool> AcceptDirect(Guid directId, Guid accountId);
        Task<Result<Guid>> DeleteDirect(Guid id, Guid accountId);
        Task<List<Direct>> GetAccountDirectsAsync(Guid userId);
        Task<List<Direct>> GetAccountDirectsAsync(Guid userId, int skip, int take);
        Task<Direct?> GetAsync(Guid id, DateTime date, int countMessages);
        Task<Direct?> GetByAccountIdsAsync(Guid userId, Guid ownerId, DateTime date, int countMessages);
    };
};