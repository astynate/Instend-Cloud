using CSharpFunctionalExtensions;

namespace Exider.Repositories.Storage
{
    public interface IFolderAccessRepository
    {
        Task CloseAccess(Guid userId, Guid folderId);
        Task<bool> GetUserAccess(Guid userId, Guid folderId);
        Task<Result> OpenAccess(Guid userId, Guid folderId);
    }
}