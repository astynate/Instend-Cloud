using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Messenger;
using Instend.Core.Models.Messages;
using Instend.Core.TransferModels.Messenger;

namespace Instend.Repositories.Messenger
{
    public interface IDirectRepository : IChatBase
    {
        Task<Result<DirectTransferModel>> CreateNewDirect(Guid userId, Guid ownerId);
        Task<Result<Guid>> DeleteDirect(Guid destination, Guid userId);
        Task<MessageModel[]> GetLastMessages(Guid destination, Guid userId, int from, int count);
    }
}