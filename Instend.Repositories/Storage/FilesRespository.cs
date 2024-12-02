using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Models.Storage.Album;
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

        public async Task<Result<Core.Models.Storage.File.File>> AddPhotoAsync(string name, string? type, double size, Guid ownerId)
        {
            var photoFolder = await _storageContext.Folders.AsNoTracking()
                .FirstOrDefaultAsync(x => x.TypeId == Configuration.CollectionTypes.System.ToString() && x.Name == "Photos" && x.AccountId == ownerId);

            if (photoFolder == null)
                return Result.Failure<Core.Models.Storage.File.File>("The system folder \"Photos\" could not be found, please try again later. If it doesn't help, contact support.");

            var fileCreationResult = Core.Models.Storage.File.File.Create(name, type, size, ownerId, photoFolder.Id);

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

        public async Task<Core.Models.Storage.File.File[]> GetByFolderId(Guid userId, Guid folderId)
        {
            var files = await _storageContext.Files
                .AsNoTracking()
                .Where(file => file.FolderId == folderId).ToArrayAsync();

            await SetFilesPreview(files); return files;
        }

        public async Task<object[]> GetByFolderIdWithMetaData(Guid userId, Guid folderId)
        {
            var files = await _storageContext.Files
                .AsNoTracking()
                .Where(x => (folderId == Guid.Empty) ? x.FolderId == folderId && x.AccountId == userId : x.FolderId == folderId)
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

            _storageContext.Files.Update(fileModel);

            await _storageContext.SaveChangesAsync();
            return Result.Success(fileModel);
        }

        public async Task<Result> Delete(Guid id)
        {
            var file = await _storageContext.Files.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (file == null)
                return Result.Failure("File not found");

            var path = file.Path;

            await _storageContext.Files
                .Where(x => x.Id == id)
                .ExecuteDeleteAsync();
            
            var result = await _accountsRepository
                .ChangeOccupiedSpaceValue(file.AccountId, file.Size);

            if (result.IsFailure)
                return Result.Failure(result.Error);

            System.IO.File.Delete(path);

            await _storageContext.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<Core.Models.Storage.File.File[]> GetLastPhotoByUserIdAsync(Guid userId, int from, int count)
        {
            return [];
            //return await _storageContext.Files.AsNoTracking()
            //    .Where(x => x.AccountId == userId && Configuration.imageTypes.Contains(x.Type))
            //    .Skip(from)
            //    .Take(count)
            //    .ToArrayAsync();
        }

        public async Task<Core.Models.Storage.File.File[]> GetLastPhotoFromAlbum(Guid userId, Guid albumId, int from, int count)
        {
            return [];
            //return await _storageContext.AlbumFiles
            //    .AsNoTracking()
            //    .Where(x => x.ItemId == albumId)
            //    .Skip(from)
            //    .Take(count)
            //    .Join(_storageContext.Files,
            //        albumLink => albumLink.LinkedItemId,
            //        fileModel => fileModel.Id,
            //        (albumLink, fileModel) => fileModel)
            //    .ToArrayAsync();
        }

        public async Task<Album[]> GetLastItemsFromAlbum(Guid userId, Guid albumId, int from, int count)
        {
            var result = await _storageContext.Albums
                .AsNoTracking()
                .Where(x => x.Id == albumId)
                .Include(x => x.File)
                .ToArrayAsync();

            return result;
        }

        public async Task<object[]> GetLastFilesWithType(Guid userId, int from, int count, string[] type)
        {
            var result = await _storageContext.Files
                .AsNoTracking()
                .Where(x => x.AccountId == userId && type.Contains(x.Type))
                .Skip(from)
                .Take(count)
                .ToArrayAsync();

            return result;
        }

        public async Task<object[]> GetFilesByPrefix(Guid userId, string prefix)
        {
            var result = await _storageContext.Files.AsNoTracking()
                .Where(x => x.AccountId == userId && x.Name.ToLower().Contains(prefix.ToLower()))
                .Take(6)
                .ToArrayAsync();

            return result;
        }
    }
}