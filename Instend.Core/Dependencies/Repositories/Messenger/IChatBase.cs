using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;
using Instend.Core.TransferModels.Messenger;
using Instend.Repositories.Messenger;
using Instend.Services.External.FileService;

namespace Instend.Core.Dependencies.Repositories.Messenger
{
    public interface IChatBase
    {
        Task<Result<DatabaseModel>> SendMessage(IFileService fileService, IMessengerRepository messengerRepository, MessageTransferModel message, Guid senderId);
    }
}