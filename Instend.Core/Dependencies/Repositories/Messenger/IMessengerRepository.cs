using CSharpFunctionalExtensions;
using Exider.Core.Models.Messages;
using Exider.Core.TransferModels;
using Exider.Services.External.FileService;

namespace Exider.Repositories.Messenger
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