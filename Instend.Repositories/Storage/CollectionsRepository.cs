﻿using CSharpFunctionalExtensions;
using Instend.Core;
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
                .Include(x => x.AccountsWithAccess)
                    .ThenInclude(x => x.Account)
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
                .ThenInclude(x => x.AccountsWithAccess)
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

        public async Task<IEnumerable<Collection>> GetCollectionsByParentId(Guid accountId, Guid? parentCollectionId, int skip, int take = 5)
        {
            if (parentCollectionId == null)
            {
                return await _context.CollectionsAccounts
                    .Include(x => x.Account)
                    .Where(x => x.Account.Id == accountId)
                    .Include(x => x.Collection)
                    .Where(x => x.Collection != null && x.Collection.CollectionId == parentCollectionId)
                    .Select(x => x.Collection)
                    .ToArrayAsync();
            }

            return await _context.Collections
                .Where(x => x.CollectionId == parentCollectionId)
                .ToArrayAsync();
        }

        public async Task<IEnumerable<Collection?>> GetShortPathAsync(Guid? collectionId)
        {
            List<Collection> result = [];

            var queryResult = await _context.Collections
                .AsNoTracking()
                .Where(x => x.Id == collectionId)
                .Include(x => x.ParentCollection)
                .FirstOrDefaultAsync();

            while (queryResult != null)
            {
                result.Add(queryResult);
                queryResult = queryResult.ParentCollection;
            };

            return result;
        }

        public async Task<Result<Collection>> AddAsync(string name, Core.Models.Account.Account account, Guid? collectionId, Configuration.CollectionTypes collectionType)
        {
            var collection = Collection.Create(name, collectionId, collectionType);

            if (collection.IsFailure)
                return Result.Failure<Collection>(collection.Error);

            var owner = new CollectionAccount
            (
                collection.Value.Id, 
                account.Id, 
                Configuration.EntityRoles.Owner
            );

            _context.Attach(collection.Value);

            collection.Value.AccountsWithAccess.Add(owner);

            await _context.AddAsync(collection.Value);
            await _context.SaveChangesAsync();

            return Result.Success(collection.Value);
        }

        public async Task UpdateNameAsync(Guid id, string name)
            => await _context.Collections.Where(x => x.Id == id).ExecuteUpdateAsync(property => property.SetProperty(x => x.Name, name));

        public async Task DeleteAsync(Guid id) {
            var collection = await _context.Collections
                .Include(x => x.Collections)
                    .ThenInclude(x => x.Files)
                    .Take(30)
                .Include(x => x.Collections)
                    .ThenInclude(x => x.Collections)
                    .Take(30)
                .Include(x => x.Files)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (collection != null)
            {
                _context.Remove(collection);
                await _context.SaveChangesAsync();
            }
        }
    }
}