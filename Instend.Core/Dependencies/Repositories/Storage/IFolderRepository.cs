using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Storage.Collection;
using Instend.Services.External.FileService;

namespace Instend.Repositories.Storage
{
    public interface IFolderRepository
    {
        Task<Collection[]> GetFoldersByUserId(Guid userId);
        Task<Collection[]> GetSystemFolders(Guid userId);
        Task<Collection?> GetSystemFolder(string name, Guid userId);
        Task<Result<Collection>> AddAsync(string name, Guid ownerId, Guid folderId);
        Task<Collection[]> GetFoldersByFolderId(Guid userId, Guid folderId);
        Task<Collection?> GetByIdAsync(Guid id, Guid userId);
        Task<Collection[]> GetShortPath(Guid folderId);
        Task<Result<Collection>> AddAsync(string name, Guid ownerId, Guid folderId, Configuration.CollectionTypes folderType, bool visibility);
        Task UpdateName(Guid id, string name);
        Task Delete(Guid id);
    }
}