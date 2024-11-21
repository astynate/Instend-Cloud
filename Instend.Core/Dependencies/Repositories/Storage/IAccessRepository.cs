using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Abstraction;
using Instend.Core.TransferModels.Access;

namespace Instend.Repositories.Storage
{
    public interface IAccessRepository<Access, Item>
        where Access : AccessBase, new()
        where Item : AccessItemBase, new()
    {
        Task CloseAccess(Guid userId, Guid folderId);
        Task CrearAccess(Guid folderId);
        Task<bool> GetUserAccess(Guid userId, Guid folderId);
        Task<AccessTransferModel[]> GetUsersWithAccess(Guid folderId);
        Task<Result> OpenAccess(Guid userId, Guid folderId, Configuration.Abilities ability);
        Task<Result> UpdateAccessState(Configuration.AccessTypes type, Guid userId, Guid folderId);
    }
}