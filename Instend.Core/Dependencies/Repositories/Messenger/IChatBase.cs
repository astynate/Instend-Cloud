using CSharpFunctionalExtensions;
using Instend.Core.TransferModels.Messenger;

namespace Instend.Core.Dependencies.Repositories.Messenger
{
    public interface IChatBase
    {
        Task<Result<MessengerTransferModelBase>> SendMessage(Guid ownerId, Guid userId, string text);
    }
}