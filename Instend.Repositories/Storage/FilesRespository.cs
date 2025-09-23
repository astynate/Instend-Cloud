using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Storage.Files;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Storage
{
    public class FilesRespository : IFilesRespository
    {
        private readonly GlobalContext _context = null!;

        public FilesRespository(GlobalContext storageContext)
        {
            _context = storageContext;
        }

        public async Task<Result<Core.Models.Storage.File.File>> GetByIdAsync(Guid id)
        {
            var result = await _context.Files
                .AsNoTracking()
                .Include(x => x.AccountsWithAccess)
                .FirstOrDefaultAsync(x => x.Id == id);

            return result ?? Result.Failure<Core.Models.Storage.File.File>("File not found");
        }

        public async Task<Result<Core.Models.Storage.File.File>> AddAsync(string name, string? type, double size, Guid accountId, string? collectionId)
        {
            Guid? collectionIdAsGuid = null;

            if (Configuration.SystemCollections.Contains(collectionId))
            {
                var collections = await _context.CollectionsAccounts
                    .Where(x => x.AccountId == accountId && x.RoleId == Configuration.EntityRoles.Owner.ToString())
                    .Include(x => x.Collection)
                    .FirstOrDefaultAsync(x => x.Collection != null && 
                                              x.Collection.Name == collectionId && 
                                              x.Collection.TypeId == Configuration.CollectionTypes.System.ToString());

                if (collections != null)
                    collectionIdAsGuid = collections.CollectionId;

                if (collectionId == "Music" && Configuration.musicTypes.Contains(type) == false)
                    return Result.Failure<Core.Models.Storage.File.File>("Invalid type");

                if (collectionId == "Photos" && (Configuration.videoTypes.Contains(type) == false || Configuration.imageTypes.Contains(type) == false))
                    return Result.Failure<Core.Models.Storage.File.File>("Invalid type");
            }

            if (Guid.TryParse(collectionId, out Guid id))
                collectionIdAsGuid = id;

            var file = Core.Models.Storage.File.File.Create(name, type, size, accountId, collectionIdAsGuid);

            var owner = new FileAccount
            (
                file.Value.Id,
                accountId,
                Configuration.EntityRoles.Owner
            );

            _context.Attach(file.Value);

            file.Value.AccountsWithAccess.Add(owner);

            await _context.AddAsync(file.Value);
            await _context.SaveChangesAsync();

            return Result.Success(file.Value);
        }

        public async Task<Core.Models.Storage.File.File[]> GetByParentCollectionId(Guid accountId, Guid? parentCollectionId, int skip, int take)
        {
            if (parentCollectionId == null)
            {
                return await _context.FilesAccounts
                    .AsNoTracking()
                    .Where(x => x.AccountId == accountId)
                    .Include(x => x.File)
                    .Where(file => file.File.CollectionId == parentCollectionId)
                    .Skip(skip)
                    .Take(take)
                    .Select(x => x.File)
                    .ToArrayAsync();
            }

            return await _context.Files
                .Where(x => x.CollectionId == parentCollectionId)
                .ToArrayAsync();
        }

        public async Task<Result<Core.Models.Storage.File.File>> UpdateName(Guid id, string name)
        {
            var file = await GetByIdAsync(id);

            if (file.IsFailure)
                return Result.Failure<Core.Models.Storage.File.File>(file.Error);

            _context.Attach(file.Value);

            file.Value.Rename(name);

            _context.Files.Update(file.Value);

            await _context.SaveChangesAsync();
            return Result.Success(file.Value);
        }

        public async Task Delete(Guid id)
        {
            var file = await _context.Files
                .FirstOrDefaultAsync(x => x.Id == id);

            if (file != null)
            {
                _context.Files.Remove(file);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Core.Models.Storage.File.File[]> GetLastFilesWithType(Guid accountId, int from, int count, string[] types)
        {
            var result = await _context.FilesAccounts
                .AsNoTracking()
                .Where(x => x.AccountId == accountId)
                .Include(x => x.File)
                .Where(x => types.Contains(x.File.Type))
                .OrderByDescending(x => x.File.CreationTime)
                .Skip(from)
                .Take(count)
                .Select(x => x.File)
                .ToArrayAsync();

            return result;
        }

        public async Task<object[]> GetFilesByPrefix(Guid userId, string prefix)
        {
            //var result = await _context.FilesAccounts
            //    .AsNoTracking()
            //    .Include(x => x.Account)
            //    .Include(x => x.File)
            //    .Where(x => x.Account.Id == userId && x.File.Name.ToLower().Contains(prefix.ToLower()))
            //    .Take(6)
            //    .ToArrayAsync();

            return [];
        }

        public async Task<List<Core.Models.Storage.File.File>> GetFilesByIdsAsync(Guid[] ids)
        {
            return await _context.Files
                .AsNoTracking()
                .Where(x => ids.Contains(x.Id))
                    .Include(x => x.AccountsWithAccess)
                    .ToListAsync();
        }
    }
}