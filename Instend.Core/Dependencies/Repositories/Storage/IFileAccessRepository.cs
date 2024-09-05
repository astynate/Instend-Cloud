using CSharpFunctionalExtensions;

namespace Exider.Repositories.Storage
{
    public interface IFileAccessRepository
    {
        Task CloseAccess(Guid userId, Guid fileId);
        Task<bool> GetUserAccess(Guid userId, Guid fileId);
        Task<Result> OpenAccess(Guid userId, Guid fileId);
    }
}