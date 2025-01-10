using CSharpFunctionalExtensions;
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

        public async Task<Result<Core.Models.Storage.File.File>> GetByIdAsync(Guid id) => await _context.Files.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id) ?? Result.Failure<Core.Models.Storage.File.File>("Not found");

        public async Task<Result<Core.Models.Storage.File.File>> AddAsync(string name, string? type, double size, Guid ownerId, Guid folderId)
        {
            var fileCreationResult = Core.Models.Storage.File.File.Create(name, type, size, ownerId, folderId);

            if (fileCreationResult.IsFailure == true)
                return Result.Failure<Core.Models.Storage.File.File>(fileCreationResult.Error);

            await _context.AddAsync(fileCreationResult.Value);
            await _context.SaveChangesAsync();

            return Result.Success(fileCreationResult.Value);
        }

        public async Task<Core.Models.Storage.File.File[]> GetByParentCollectionId(Guid userId, Guid parentCollectionId, int skip, int take)
        {
            var files = await _context.Files
                .AsNoTracking()
                .Where(file => file.FolderId == parentCollectionId)
                .Skip(skip)
                .Take(take)
                .ToArrayAsync();

            return files;
        }

        public async Task<Result<Core.Models.Storage.File.File>> UpdateName(Guid id, string name)
        {
            var file = await GetByIdAsync(id);

            if (file.IsFailure)
                return Result.Failure<Core.Models.Storage.File.File>(file.Error);

            var fileModel = file.Value;
            fileModel.Rename(name);

            _context.Files.Update(fileModel);

            await _context.SaveChangesAsync();
            return Result.Success(fileModel);
        }

        public async Task Delete(Guid id)
        {
            await _context.Files
                .Where(x => x.Id == id)
                .ExecuteDeleteAsync();
        }

        public async Task<object[]> GetLastFilesWithType(Guid accountId, int from, int count, string[] type)
        {
            var result = await _context.FilesAccounts
                .AsNoTracking()
                .Include(x => x.Account)
                .Where(x => x.Account.Id == accountId)
                .Include(x => x.File)
                .Skip(from)
                .Take(count)
                .ToArrayAsync();

            return result;
        }

        public async Task<object[]> GetFilesByPrefix(Guid userId, string prefix)
        {
            var result = await _context.FilesAccounts
                .AsNoTracking()
                .Include(x => x.Account)
                .Include(x => x.File)
                .Where(x => x.Account.Id == userId && x.File.Name.ToLower().Contains(prefix.ToLower()))
                .Take(6)
                .ToArrayAsync();

            return result;
        }
    }
}