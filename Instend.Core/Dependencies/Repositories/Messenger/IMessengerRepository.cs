using CSharpFunctionalExtensions;
using Instend.Core.Models.Messages;
using Instend.Core.TransferModels.Messenger;
using Instend.Services.External.FileService;

namespace Instend.Repositories.Messenger
{
    public interface IMessengerRepository
    {
        Task<DirectTransferModel[]> GetDirects(IFileService fileService, Guid userId, int count);
        Task<DirectTransferModel?> GetDirect(IFileService fileService, Guid id, Guid userId);
        Task<Result<bool>> ChangeAcceptState(Guid directId, Guid userId, bool isAccept);
        Task<Result<Guid>> DeleteMessage(Guid id, Guid userId);
        Task<bool> ChangePinnedState(Guid messageId, bool pinnedState);
        Task<bool> ViewMessage(Guid messageId, Guid userId);
        Task SetAttachments(MessageModel model);
    }
}