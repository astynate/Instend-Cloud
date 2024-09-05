using CSharpFunctionalExtensions;
using Exider.Core.Dependencies.Repositories.Messenger;
using Exider.Core.Models.Messages;
using Exider.Core.Models.Messenger;
using Exider.Core.TransferModels;

namespace Exider.Repositories.Messenger
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