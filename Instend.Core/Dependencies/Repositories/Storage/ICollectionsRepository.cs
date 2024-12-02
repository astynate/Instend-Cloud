using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Storage.Collection;

namespace Instend.Repositories.Storage
{
    public interface ICollectionsRepository
    {
        Task<Collection[]> GetCollectionsByParentId(Guid userId, Guid folderId);
        Task<Collection?> GetByIdAsync(Guid id, Guid userId);
        Task<Collection[]> GetShortPathAsync(Guid folderId);
        Task<Collection[]> GetCollectionsByAccountId(Guid userId);
        Task<Collection[]> GetSystemCollections(Guid userId);
        Task<Collection?> GetSystemCollection(string name, Guid userId);
        Task<Result<Collection>> AddAsync(string name, Guid ownerId, Guid folderId);
        Task<Result<Collection>> AddAsync(string name, Guid ownerId, Guid folderId, Configuration.CollectionTypes folderType, bool visibility);
        Task UpdateNameAsync(Guid id, string name);
        Task DeleteAsync(Guid id);
    }
}