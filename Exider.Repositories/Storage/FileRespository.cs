using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;
using System;

namespace Exider.Repositories.Storage
{
    public class FileRespository : IFileRespository
    {
        private readonly DatabaseContext _context = null!;

        private readonly IFileService _fileService;

        public FileRespository(DatabaseContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<Result<FileModel>> GetByIdAsync(Guid id) => await _context.Files.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id) ?? Result.Failure<FileModel>("Not found");

        public async Task<Result<FileModel>> AddAsync(string name, string? type, Guid ownerId, Guid folderId)
        {
            var fileCreationResult = FileModel.Create(name, type, ownerId, folderId);

            if (fileCreationResult.IsFailure == true)
            {
                return Result.Failure<FileModel>(fileCreationResult.Error);
            }

            await _context.AddAsync(fileCreationResult.Value);
            await _context.SaveChangesAsync();

            return Result.Success(fileCreationResult.Value);
        }

        public async Task<Result<FileModel>> AddPhotoAsync(string name, string? type, Guid ownerId)
        {
            var photoFolder = await _context.Folders.AsNoTracking()
                .FirstOrDefaultAsync(x => x.TypeId == Configuration.FolderTypes.System.ToString() && x.Name == "Photos" && x.OwnerId == ownerId);

            if (photoFolder == null)
            {
                return Result.Failure<FileModel>("The system folder \"Photos\" could not be found, please try again later. If it doesn't help, contact support.");
            }

            var fileCreationResult = FileModel.Create(name, type, ownerId, photoFolder.Id);

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

            File.Delete(path);

            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<FileModel[]> GetLastPhotoByUserIdAsync(Guid userId, int from, int count)
        {
            return await _context.Files.AsNoTracking()
                .OrderByDescending(x => x.CreationTime)
                .Where(x => x.OwnerId == userId && Configuration.imageTypes.Contains(x.Type))
                .Skip(from)
                .Take(count)
                .ToArrayAsync();
        }

        public async Task<FileModel[]> GetLastPhotoFromAlbum(Guid userId, Guid albumId, int from, int count)
        {
            return await _context.AlbumLinks.AsNoTracking()
                .Where(x => x.AlbumId == albumId)
                .Skip(from)
                .Take(count)
                .Join(_context.Files,
                    albumLink => albumLink.FileId,
                    fileModel => fileModel.Id,
                    (albumLink, fileModel) => fileModel)
                .ToArrayAsync();
        }
    }
}