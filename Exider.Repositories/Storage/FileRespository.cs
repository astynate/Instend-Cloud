using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Storage;
using Exider.Repositories.Account;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Storage
{
    public class FileRespository : IFileRespository
    {
        private readonly DatabaseContext _context = null!;

        private readonly IFileService _fileService;

        private readonly IUserDataRepository _userDataRepository;

        public FileRespository(DatabaseContext context, IFileService fileService, IUserDataRepository userDataRepository)
        {
            _context = context;
            _fileService = fileService;
            _userDataRepository = userDataRepository;
        }

        public async Task<Result<FileModel>> GetByIdAsync(Guid id) => await _context.Files.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id) ?? Result.Failure<FileModel>("Not found");

        public async Task<Result<FileModel>> AddAsync(string name, string? type, double size, Guid ownerId, Guid folderId)
        {
            var fileCreationResult = FileModel.Create(name, type, size, ownerId, folderId);

            if (fileCreationResult.IsFailure == true)
            {
                return Result.Failure<FileModel>(fileCreationResult.Error);
            }

            await _context.AddAsync(fileCreationResult.Value);
            await _context.SaveChangesAsync();

            return Result.Success(fileCreationResult.Value);
        }

        public async Task<Result<FileModel>> AddPhotoAsync(string name, string? type, double size, Guid ownerId)
        {
            var photoFolder = await _context.Folders.AsNoTracking()
                .FirstOrDefaultAsync(x => x.TypeId == Configuration.FolderTypes.System.ToString() && x.Name == "Photos" && x.OwnerId == ownerId);

            if (photoFolder == null)
            {
                return Result.Failure<FileModel>("The system folder \"Photos\" could not be found, please try again later. If it doesn't help, contact support.");
            }

            var fileCreationResult = FileModel.Create(name, type, size, ownerId, photoFolder.Id);

            if (fileCreationResult.IsFailure == true)
            {
                return Result.Failure<FileModel>(fileCreationResult.Error);
            }

            await _context.AddAsync(fileCreationResult.Value);
            await _context.SaveChangesAsync();

            return Result.Success(fileCreationResult.Value);
        }

        public async Task<FileModel[]> GetByFolderId(Guid userId, Guid folderId)
        {
            FileModel[] files;

            if (folderId == Guid.Empty)
            {
                files = await _context.Files.AsNoTracking()
                    .Where(x => x.FolderId == folderId && x.OwnerId == userId).ToArrayAsync();
            }
            else
            {
                files = await _context.Files.AsNoTracking()
                    .Where(x => x.FolderId == folderId).ToArrayAsync();
            }

            Array.ForEach(files, async
                x => await x.SetPreview(_fileService));

            return files;
        }

        public async Task<object[]> GetByFolderIdWithMetaData(Guid userId, Guid folderId)
        {
            var files = await _context.Files.AsNoTracking()
                    .Where(x => (folderId == Guid.Empty) ? x.FolderId == folderId && x.OwnerId == userId : x.FolderId == folderId)
                    .GroupJoin(_context.SongsMeta,
                        file => file.Id,
                        meta => meta.FileId,
                        (x, y) => new { File = x, Meta = y })
                    .SelectMany(
                        x => x.Meta.DefaultIfEmpty(),
                        (x, y) => new { x.File, Meta = y })
                    .ToArrayAsync();

            Array.ForEach(files, async
                x => await x.File.SetPreview(_fileService));

            return files;
        }

        public async Task<Result<FileModel>> UpdateName(Guid id, string name)
        {
            var getFileOperation = await GetByIdAsync(id);

            if (getFileOperation.IsFailure)
            {
                return Result.Failure<FileModel>(getFileOperation.Error);
            }

            FileModel fileModel = getFileOperation.Value;
            fileModel.Rename(name);

            _context.Files.Update(fileModel);

            await _context.SaveChangesAsync();
            return Result.Success(fileModel);
        }

        public async Task<Result> Delete(Guid id)
        {
            FileModel? file = await _context.Files.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (file == null)
            {
                return Result.Failure("File not found");
            }

            string path = file.Path;
            await _context.Files.Where(x => x.Id == id).ExecuteDeleteAsync();
            
            var result = await _userDataRepository.DecreaseOccupiedSpace(file.OwnerId, file.Size);

            if (result.IsFailure)
            {
                return Result.Failure(result.Error);
            }

            File.Delete(path);

            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<FileModel[]> GetLastPhotoByUserIdAsync(Guid userId, int from, int count)
        {
            return await _context.Files.AsNoTracking()
                //.OrderByDescending(x => x.CreationTime)
                .Where(x => x.OwnerId == userId && Configuration.imageTypes.Contains(x.Type))
                .Skip(from)
                .Take(count)
                .ToArrayAsync();
        }

        public async Task<FileModel[]> GetLastPhotoFromAlbum(Guid userId, Guid albumId, int from, int count)
        {
            return await _context.AlbumLinks.AsNoTracking()
                .Where(x => x.ItemId == albumId)
                .Skip(from)
                .Take(count)
                .Join(_context.Files,
                    albumLink => albumLink.LinkedItemId,
                    fileModel => fileModel.Id,
                    (albumLink, fileModel) => fileModel)
                .ToArrayAsync();
        }

        /// <summary>
        /// Get files with metafata and set preview
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="albumId"></param>
        /// <param name="from"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        public async Task<object[]> GetLastItemsFromAlbum(Guid userId, Guid albumId, int from, int count)
        {
            var result = await _context.AlbumLinks.AsNoTracking()
                .Where(x => x.ItemId == albumId)
                .Skip(from)
                .Take(count)
                .Join(_context.Files,
                    albumLink => albumLink.LinkedItemId,
                    fileModel => fileModel.Id,
                    (albumLink, fileModel) => new { AlbumLink = albumLink, File = fileModel })
                .GroupJoin(_context.SongsMeta,
                    combined => combined.File.Id,
                    meta => meta.FileId,
                    (combined, meta) => new { combined.File, Meta = meta.DefaultIfEmpty() })
                .SelectMany(
                    combined => combined.Meta,
                    (combined, meta) => new { combined.File, Meta = meta })
                .ToArrayAsync();

            Array.ForEach(result, async
                x => await x.File.SetPreview(_fileService));

            return result;
        }

        public async Task<object[]> GetLastFilesWithType(Guid userId, int from, int count, string[] type)
        {
            var result = await _context.Files.AsNoTracking()
                .Where(x => x.OwnerId == userId && type.Contains(x.Type))
                .Skip(from)
                .Take(count)
                .GroupJoin(_context.SongsMeta,
                        file => file.Id,
                        meta => meta.FileId,
                        (x, y) => new { File = x, Meta = y })
                    .SelectMany(
                        x => x.Meta.DefaultIfEmpty(),
                        (x, y) => new { x.File, Meta = y })
                    .ToArrayAsync();

            Array.ForEach(result, async
                x => await x.File.SetPreview(_fileService));

            return result;
        }
    }
}