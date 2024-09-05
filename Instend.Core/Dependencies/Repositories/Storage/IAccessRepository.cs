using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Access;
using Exider.Core.TransferModels;

namespace Exider.Repositories.Storage
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