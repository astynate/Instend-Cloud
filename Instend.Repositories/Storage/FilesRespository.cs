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

        public async Task<Result<Core.Models.Storage.File.File>> AddAsync(string name, string? type, double size, Guid accountId, Guid? collectionId)
        {
            var file = Core.Models.Storage.File.File.Create(name, type, size, accountId, collectionId);

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
            var files = await _context.FilesAccounts
                .AsNoTracking()
                .Where(x => x.AccountId == accountId)
                .Include(x => x.File)
                .Where(file => file.File.CollectionId == parentCollectionId)
                .Skip(skip)
                .Take(take)
                .Select(x => x.File)
                .ToArrayAsync();

            return files;
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

        public async Task<object[]> GetLastFilesWithType(Guid accountId, int from, int count, string[] type)
        {
            //var result = await _context.FilesAccounts
            //    .AsNoTracking()
            //    .Include(x => x.Account)
            //    .Where(x => x.Account.Id == accountId)
            //    .Include(x => x.File)
            //    .Skip(from)
            //    .Take(count)
            //    .ToArrayAsync();

            return [];
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
    }
}