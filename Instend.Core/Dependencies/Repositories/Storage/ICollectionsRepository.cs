using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Storage.Collection;

namespace Instend.Repositories.Storage
{
    public interface ICollectionsRepository
    {
        Task<Collection> GetByIdAsync(Guid id);
        Task<Collection> GetSystemCollection(string name, Guid userId);
        Task<IEnumerable<Collection>> GetCollectionsByParentId(Guid userId, Guid folderId);
        Task<IEnumerable<Collection>> GetShortPathAsync(Guid folderId);
        Task<IEnumerable<Collection>> GetSystemCollections(Guid userId);
        Task<List<Collection?>> GetCollectionsByAccountId(Guid userId);
        Task<Result<Collection>> AddAsync(string name, Guid ownerId, Guid folderId);
        Task<Result<Collection>> AddAsync(string name, Guid ownerId, Guid folderId, Configuration.CollectionTypes folderType, bool visibility);
        Task UpdateNameAsync(Guid id, string name);
        Task DeleteAsync(Guid id);
    }
}