using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Messenger;
using Instend.Core.Models.Messenger.Direct;

namespace Instend.Repositories.Messenger
{
    public interface IDirectRepository : IChatBase
    {
        Task<Result<Direct>> CreateNewDirect(Guid userId, Guid ownerId);
        Task<Result<Guid>> DeleteDirect(Guid id, Guid accountId);
        Task<List<Direct>> GetAccountDirectsAsync(Guid userId);
        Task<Direct?> GetAsync(Guid id, int numberOfSkipedMessages, int countMessages);
        Task<Direct?> GetByAccountIdsAsync(Guid userId, Guid ownerId, int numberOfSkipedMessages, int countMessages);
    };
};