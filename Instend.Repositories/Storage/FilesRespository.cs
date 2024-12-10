using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Repositories.Contexts;
using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Storage
{
    public class FilesRespository : IFileRespository
    {
        private readonly StorageContext _storageContext = null!;

        private readonly IPreviewService _previewService;

        private readonly IAccountsRepository _accountsRepository;

        public FilesRespository
        (
            StorageContext storageContext,
            IAccountsRepository accountsRepository, 
            IPreviewService previewService
        )
        {
            _storageContext = storageContext;
            _accountsRepository = accountsRepository;
            _previewService = previewService;
        }

        public async Task<Result<Core.Models.Storage.File.File>> GetByIdAsync(Guid id) => await _storageContext.Files.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id) ?? Result.Failure<Core.Models.Storage.File.File>("Not found");

        public async Task<Result<Core.Models.Storage.File.File>> AddAsync(string name, string? type, double size, Guid ownerId, Guid folderId)
        {
            var fileCreationResult = Core.Models.Storage.File.File.Create(name, type, size, ownerId, folderId);

            if (fileCreationResult.IsFailure == true)
                return Result.Failure<Core.Models.Storage.File.File>(fileCreationResult.Error);

            await _storageContext.AddAsync(fileCreationResult.Value);
            await _storageContext.SaveChangesAsync();

            return Result.Success(fileCreationResult.Value);
        }

        private async Task SetFilesPreview(Core.Models.Storage.File.File[] files)
        {
            foreach (var file in files)
            {
                await file.SetPreview(_previewService);
            }
        }

        public async Task<Core.Models.Storage.File.File[]> GetByParentCollectionId(Guid userId, Guid folderId)
        {
            var files = await _storageContext.Files
                .AsNoTracking()
                .Where(file => file.FolderId == folderId).ToArrayAsync();

            await SetFilesPreview(files); return files;
        }

        public async Task<Result<Core.Models.Storage.File.File>> UpdateName(Guid id, string name)
        {
            var file = await GetByIdAsync(id);

            if (file.IsFailure)
                return Result.Failure<Core.Models.Storage.File.File>(file.Error);

            var fileModel = file.Value;
            fileModel.Rename(name);

            _storageContext.Files.Update(fileModel);

            await _storageContext.SaveChangesAsync();
            return Result.Success(fileModel);
        }

        public async Task<Result> Delete(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<object[]> GetLastFilesWithType(Guid userId, int from, int count, string[] type)
        {
            var result = await _storageContext.FilesAccounts
                .AsNoTracking()
                .Include(x => x.Account)
                .Where(x => x.Account.Id == userId)
                .Include(x => x.File)
                .Skip(from)
                .Take(count)
                .ToArrayAsync();

            return result;
        }

        public async Task<object[]> GetFilesByPrefix(Guid userId, string prefix)
        {
            var result = await _storageContext.FilesAccounts
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