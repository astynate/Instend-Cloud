using CSharpFunctionalExtensions;
using Exider.Core.Models.Messages;
using Exider.Core.Models.Messenger;

namespace Exider.Repositories.Messenger
{
    public interface IDirectRepository
    {
        Task<Result<DirectModel>> CreateNewDiret(Guid userId, Guid ownerId);
        Task<Result<(MessageModel, DirectModel)>> SendMessage(Guid ownerId, Guid userId, string text);
    }
}