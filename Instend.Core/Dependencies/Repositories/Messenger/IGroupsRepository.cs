using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Messenger;
using Instend.Core.Models.Messenger.Group;

namespace Instend.Repositories.Messenger
{
    public interface IGroupsRepository : IChatBase
    {
        Task<Result<Group>> Create(string name, byte[] avatar, Guid ownerId);
        Task<List<Group>> GetAccountGroups(Guid id);
        Task<Group?> GetByIdAsync(Guid id, Guid userId, int from, int count);
    }
}