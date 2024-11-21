using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Storage;
using Instend.Services.External.FileService;

namespace Instend.Repositories.Storage
{
    public interface IFolderRepository
    {
        Task<FolderModel[]> GetFoldersByUserId(Guid userId);
        Task<FolderModel[]> GetSystemFolders(Guid userId);
        Task<FolderModel?> GetSystemFolder(string name, Guid userId);
        Task<Result<FolderModel>> AddAsync(string name, Guid ownerId, Guid folderId);
        Task<FolderModel[]> GetFoldersByFolderId(Guid userId, Guid folderId);
        Task<FolderModel?> GetByIdAsync(Guid id, Guid userId);
        Task<FolderModel[]> GetShortPath(Guid folderId);
        Task<Result<FolderModel>> AddAsync(string name, Guid ownerId, Guid folderId, Configuration.FolderTypes folderType, bool visibility);
        Task UpdateName(Guid id, string name);
        Task Delete(Guid id);
    }
}