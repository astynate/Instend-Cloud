using CSharpFunctionalExtensions;
using Instend.Core.Models.Messenger.Message;
using Instend.Core.TransferModels.Messenger;
using Instend.Services.External.FileService;

namespace Instend.Repositories.Messenger
{
    public interface IMessengerRepository
    {
        Task<Result<Message>> CreateMessage(IFileService fileService, MessageTransferModel message, Guid senderId);
        Task<bool> DeleteMessage(Guid id, Guid userId);
        Task<bool> ViewMessage(Guid messageId, Guid userId);
    }
}