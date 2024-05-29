using Exider.Core.TransferModels;
using Exider.Services.External.FileService;

namespace Exider.Repositories.Messenger
{
    public interface IMessengerReposiroty
    {
        Task<MessengerTransferModel[]> GetDirects(IFileService fileService, Guid userId);
    }
}