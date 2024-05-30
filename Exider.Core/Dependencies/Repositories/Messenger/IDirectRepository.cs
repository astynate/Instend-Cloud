using CSharpFunctionalExtensions;
using Exider.Core.Dependencies.Repositories.Messenger;
using Exider.Core.TransferModels;

namespace Exider.Repositories.Messenger
{
    public interface IDirectRepository : IChatBase
    {
        Task<Result<MessengerTransferModel>> CreateNewDiret(Guid userId, Guid ownerId);
    }
}