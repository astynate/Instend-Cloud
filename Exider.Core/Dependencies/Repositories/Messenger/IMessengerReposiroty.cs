using CSharpFunctionalExtensions;
using Exider.Core.TransferModels;
using Exider.Services.External.FileService;

namespace Exider.Repositories.Messenger
{
    public interface IMessengerReposiroty
    {
        Task<MessengerTransferModel[]> GetDirects(IFileService fileService, Guid userId);
        Task<MessengerTransferModel?> GetDirect(IFileService fileService, Guid id, Guid userId);
        Task<Result<bool>> ChangeAcceptState(Guid directId, Guid userId, bool isAccept);
        Task<Result<Guid>> DeleteMessage(Guid id, Guid userId);
        Task<bool> ChangePinnedState(Guid messageId, bool pinnedState);
    }
}