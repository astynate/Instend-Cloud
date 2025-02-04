using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Messenger;
using Instend.Core.Models.Messenger.Group;

namespace Instend.Repositories.Messenger
{
    public interface IGroupsRepository : IChatBase
    {
        Task<Result<Group>> Create(string name, byte[] avatar, string type, Guid ownerId);
        Task<List<Group>> GetAccountGroups(Guid id);
        Task<Result> DeleteGroupAsync(Guid id, Guid accountId);
        Task<List<Group>> GetAccountGroups(Guid accountId, int skip, int take);
        Task<Group?> GetByIdAsync(Guid id, Guid userId, DateTime date, int count);
    }
}