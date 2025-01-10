using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Storage.Collection;

namespace Instend.Repositories.Storage
{
    public interface ICollectionsRepository
    {
        Task<Result<Collection>> AddAsync(string name, Guid ownerId, Guid folderId);
        Task<Result<Collection>> AddAsync(string name, Guid ownerId, Guid folderId, Configuration.CollectionTypes folderType, bool visibility);
        Task DeleteAsync(Guid id);
        Task<Collection?> GetByIdAsync(Guid id);
        Task<List<Collection>> GetCollectionsByAccountId(Guid userId);
        Task<IEnumerable<Collection>> GetCollectionsByParentId(Guid userId, Guid parentCollectionId, int skip, int take);
        Task<IEnumerable<Collection>> GetShortPathAsync(Guid? collectionId);
        Task<IEnumerable<Collection>> GetShortPathAsync(Guid folderId);
        Task<Collection?> GetSystemCollection(string name, Guid userId);
        Task<IEnumerable<Collection>> GetSystemCollections(Guid userId);
        Task UpdateNameAsync(Guid id, string name);
    }
}