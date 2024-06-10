using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;

namespace Exider.Repositories.Storage
{
    public interface IFolderRepository
    {
        Task<FolderModel[]> GetSystemFolders(Guid userId);
        Task<Result<FolderModel>> AddAsync(string name, Guid ownerId, Guid folderId);
        Task<FolderModel[]> GetFoldersByFolderId(IFileService fileService, Guid userId, Guid folderId);
        Task<FolderModel?> GetByIdAsync(string id, Guid userId);
        Task<FolderModel[]> GetShortPath(Guid folderId);
        Task UpdateName(Guid id, string name);
        Task Delete(Guid id);
        Task<FolderModel[]> GetFoldersByUserId(Guid userId);
        Task<Result<FolderModel>> AddAsync(string name, Guid ownerId, Guid folderId, Configuration.FolderTypes folderType, bool visibility);
    }
}