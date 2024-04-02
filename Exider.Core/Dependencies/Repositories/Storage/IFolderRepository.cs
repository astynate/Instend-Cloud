using CSharpFunctionalExtensions;
using Exider.Core.Models.Storage;

namespace Exider.Repositories.Storage
{
    public interface IFolderRepository
    {
        Task<Result> AddAsync(string name, Guid ownerId, Guid folderId);
        Task<FolderModel[]> GetByFolderId(Guid userId, Guid folderId);
        Task<FolderModel> GetByIdAsync(Guid id);
    }
}