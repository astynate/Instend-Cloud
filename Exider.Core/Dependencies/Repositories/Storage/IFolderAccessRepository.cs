using CSharpFunctionalExtensions;
using Exider.Core;

namespace Exider.Repositories.Storage
{
    public interface IFolderAccessRepository
    {
        Task CloseAccess(Guid userId, Guid folderId);
        Task CrearAccess(Guid folderId);
        Task<bool> GetUserAccess(Guid userId, Guid folderId);
        Task<object[]> GetUsersWithAccess(Guid folderId);
        Task<Result> OpenAccess(Guid userId, Guid folderId, Configuration.Abilities ability);
        Task<Result> UpdateAccessState(Configuration.AccessTypes type, Guid userId, Guid folderId);
    }
}