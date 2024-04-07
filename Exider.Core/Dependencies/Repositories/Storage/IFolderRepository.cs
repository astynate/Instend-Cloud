using CSharpFunctionalExtensions;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;

namespace Exider.Repositories.Storage
{
    public interface IFolderRepository
    {
        Task<Result> AddAsync(string name, Guid ownerId, Guid folderId);
        Task<FolderModel[]> GetFoldersByFolderId(IFileService fileService, Guid userId, Guid folderId);
        Task<FolderModel> GetByIdAsync(Guid id);
        Task<FolderModel[]> GetShortPath(Guid folderId);
        Task UpdateName(Guid id, string name);
        Task Delete(Guid id);
    }
}