using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Access;
using Instend.Core.Models.Storage.Collection;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Storage
{
    public class CollectionsRepository : ICollectionsRepository
    {
        private readonly GlobalContext _context = null!;
       
        private readonly Func<CollectionAccount, bool> IsSystemCollection = (CollectionAccount c) => c.Collection != null && c.Collection.Type == Configuration.CollectionTypes.System;
        
        private readonly Func<CollectionAccount, Guid, bool> IsUserOwner = (CollectionAccount c, Guid userId) => c.Account.Id == userId && c.Role == Configuration.EntityRoles.Owner;

        private readonly Func<CollectionAccount, Guid, bool> IsIdEquals = (c, id) => c.Id == id;

        private readonly Func<CollectionAccount, string, bool> IsNameEquals = (c, name) => c.Collection != null && c.Collection.Name == name;

        public CollectionsRepository(GlobalContext storageContext)
        {
            _context = storageContext;
        }

        public async Task<Collection?> GetByIdAsync(Guid id)
        {
            var collection = await _context.Collections
                .AsNoTracking()
                .FirstOrDefaultAsync(collection => collection.Id == id);

            return collection;
        }

        public async Task<List<Collection>> GetCollectionsByAccountId(Guid userId)
        {
            var collections = await _context.CollectionsAccounts
                .AsNoTracking()
                .Include(x => x.Account)
                .Where(x => x.Account.Id == userId)
                .Include(x => x.Collection)
                .Where(x => x.Collection != null)
                .Select(x => x.Collection)
                .ToListAsync();

            return collections;
        }

        public async Task<IEnumerable<Collection>> GetSystemCollections(Guid userId)
        {
            var systemCollections = await _context.CollectionsAccounts
                .AsNoTracking()
                .Include(x => x.Collection)
                .Where(x => IsUserOwner(x, userId) && IsSystemCollection(x))
                .Select(x => x.Collection)
                .ToListAsync();

            return systemCollections;
        }

        public async Task<Collection?> GetSystemCollection(string name, Guid userId)
        {
            var systemCollections = await _context.CollectionsAccounts
                .AsNoTracking()
                .Include(x => x.Collection)
                .Where(x => IsUserOwner(x, userId) && IsSystemCollection(x) && IsNameEquals(x, name))
                .Select(x => x.Collection)
                .FirstOrDefaultAsync();

            return systemCollections;
        }

        public async Task<IEnumerable<Collection>> GetCollectionsByParentId(Guid userId, Guid parentCollectionId, int skip, int take)
        {
            var IsUserOwner = (Collection collection) => collection.FolderId == parentCollectionId;
            var IsCollectionsIdEquals = (Collection collection) => collection.FolderId == parentCollectionId;
            var IsTargetCollection = (Collection collection) => IsCollectionsIdEquals(collection) && (userId == Guid.Empty ? IsUserOwner(collection) : true);

            var collections = await _context.Collections
                .AsNoTracking()
                .Where(folder => IsTargetCollection(folder))
                .Skip(skip)
                .Take(take)
                .ToArrayAsync();

            return collections;
        }

        public async Task<IEnumerable<Collection>> GetShortPathAsync(Guid collectionId)
        {
            var path = new List<Collection>();
            var current = collectionId;

            var collection = await _context.Collections
                .AsNoTracking()
                .Where(x => x.Id == collectionId)
                .Include(x => x.ParentCollection)
                .SelectMany(x => x.Collections)
                .ToArrayAsync();

            return path;
        }

        public async Task<Result<Collection>> AddAsync(string name, Guid ownerId, Guid folderId, Configuration.CollectionTypes folderType, bool visibility)
        {
            var collection = Collection.Create(name, folderId, folderType, visibility);

            if (collection.IsFailure)
                return Result.Failure<Collection>(collection.Error);

            var owner = new CollectionAccount(collection.Value, Configuration.EntityRoles.Owner);

            collection.Value.AccountsWithAccess
                .ToList()
                .Add(owner);

            await _context.Collections.AddAsync(collection.Value);
            await _context.SaveChangesAsync();

            return Result.Success(collection.Value);
        }

        public async Task<Result<Collection>> AddAsync(string name, Guid ownerId, Guid folderId)
        {
            var folderCreationResult = Collection.Create(name, ownerId, folderId);

            if (folderCreationResult.IsFailure)
                return Result.Failure<Collection>(folderCreationResult.Error);

            await _context.Collections.AddAsync(folderCreationResult.Value);
            await _context.SaveChangesAsync();

            return Result.Success(folderCreationResult.Value);
        }

        public async Task UpdateNameAsync(Guid id, string name)
            => await _context.Collections.Where(x => x.Id == id).ExecuteUpdateAsync(property => property.SetProperty(x => x.Name, name));

        public async Task DeleteAsync(Guid id) 
            => await _context.Collections.Where(x => x.Id == id).ExecuteDeleteAsync();
    }
}