using CSharpFunctionalExtensions;
using Exider.Core.Dependencies.Repositories.Messenger;
using Exider.Core.Models.Messages;
using Exider.Core.TransferModels;

namespace Exider.Repositories.Messenger
{
    public interface IDirectRepository : IChatBase
    {
        Task<Result<DirectTransferModel>> CreateNewDirect(Guid userId, Guid ownerId);
        Task<Result<Guid>> DeleteDirect(Guid destination, Guid userId);
        Task<MessageModel[]> GetLastMessages(Guid destination, Guid userId, int from, int count);
    }
}