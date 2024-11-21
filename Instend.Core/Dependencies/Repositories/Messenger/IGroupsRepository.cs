using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Messenger;
using Instend.Core.Models.Messages;
using Instend.Core.Models.Messenger;
using Instend.Core.TransferModels.Messenger;

namespace Instend.Repositories.Messenger
{
    public interface IGroupsRepository : IChatBase
    {
        Task<Result<GroupModel>> Create(string name, byte[] avatar, Guid ownerId);
        Task<GroupTransferModel?> GetGroup(Guid id, Guid userId);
        Task<MessageModel[]> GetLastMessages(Guid destination, Guid userId, int from, int count);
        Task<GroupTransferModel[]> GetUserGroups(Guid userId, int count);
        Task<Result<(Guid[] membersToAdd, Guid[] membersToDelete)>> SetGroupMembers(Guid id, Guid[] users);
    }
}