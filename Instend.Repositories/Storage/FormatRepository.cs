using CSharpFunctionalExtensions;
using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Storage.File;

namespace Instend.Repositories.Storage
{
    public class FormatRepository<Format> : IFormatRepository<Format> where Format : FormatBase, new()
    {
        private readonly StorageContext _storageContext;

        private readonly DbSet<Format> _entities;

        private readonly IFileService _fileService;

        private readonly IPreviewService _previewService;

        public FormatRepository(StorageContext context, IFileService fileService, IPreviewService previewService)
        {
            _storageContext = context;
            _entities = context.Set<Format>();
            _fileService = fileService;
            _previewService = previewService;
        }

        public async Task<Result<object>> AddAsync(Guid fileId, string type, string path)
        {
            var result = FormatBase.Create<Format>(fileId, type, path);

            if (result.IsFailure)
            {
                return Result.Failure("This format is not supported");
            }

            await _entities.AddAsync(result.Value);
            await _storageContext.SaveChangesAsync();

            return Result.Success(result.Value);
        }

        public async Task<Result<Format?>> GetMetaDataAsync(Guid fileId)
        {
            Format? result = await _entities.FirstOrDefaultAsync(x => x.FileId == fileId);

            if (result == null)
            {
                return Result.Failure<Format?>("Metadata not found");
            }

            return result;
        }

        public async Task<Result<(Core.Models.Storage.File.File?, Format?)>> GetByIdWithMetaData(Guid fileId)
        {
            var files = await _storageContext.Files.AsNoTracking()
                .Where(x => x.Id == fileId)
                .GroupJoin(_entities,
                    file => file.Id,
                    meta => meta.FileId,
                    (x, y) => new { File = x, Meta = y })
                .SelectMany(
                    x => x.Meta.DefaultIfEmpty(),
                    (x, y) => new { x.File, Meta = y })
                .ToArrayAsync();

            if (files.Length > 0)
            {
                Array.ForEach(files, async
                    x => await x.File.SetPreview(_previewService));

                return Result.Success<(File?, Format?)>(new(files[0].File, files[0].Meta));
            }

            return Result.Failure<(File?, Format?)>("File not found");
        }

        public async Task SaveChanges(Format format)
        {
            _storageContext.Entry(format).State = EntityState.Modified; 
            await _storageContext.SaveChangesAsync();
        }
    }
}