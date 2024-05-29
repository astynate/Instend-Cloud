using CSharpFunctionalExtensions;
using Exider.Core.Models.Messages;
using Exider.Core.Models.Messenger;

namespace Exider.Core.Dependencies.Repositories.Messenger
{
    public interface IChatBase
    {
        Task<Result<(MessageModel, DirectModel)>> SendMessage(Guid ownerId, Guid userId, string text);
    }
}