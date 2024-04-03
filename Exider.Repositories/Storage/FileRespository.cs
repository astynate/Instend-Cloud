using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

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

        public async Task<Result<FileModel>> AddAsync(string name, string type, Guid ownerId, Guid folderId)
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

        public async Task<FileModel[]> GetByFolderId(Guid userId, Guid folderId)
        {
            FileModel[] files = await _context.Files.AsNoTracking()
                .Where(x => x.FolderId == folderId && x.OwnerId == userId).ToArrayAsync();

            Array.ForEach(files, async
                x => await x.SetPreview(_fileService));

            return files;
        }

        public async Task<Result> UpdateName(Guid id, string name)
        {
            var getFileOperation = await GetByIdAsync(id);

            if (getFileOperation.IsFailure)
            {
                return Result.Failure(getFileOperation.Error);
            }

            FileModel fileModel = getFileOperation.Value;
            fileModel.Rename(name);

            _context.Files.Update(fileModel);

            await _context.SaveChangesAsync();
            return Result.Success();
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
    }
}
