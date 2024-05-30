using CSharpFunctionalExtensions;
using Exider.Core.TransferModels;

namespace Exider.Core.Dependencies.Repositories.Messenger
{
    public interface IChatBase
    {
        Task<Result<MessengerTransferModel>> SendMessage(Guid ownerId, Guid userId, string text);
    }
}