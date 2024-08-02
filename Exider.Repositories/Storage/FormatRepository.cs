using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Formats;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Storage
{
    public class FormatRepository<Format> : IFormatRepository<Format> where Format : FormatBase, new()
    {
        private readonly DatabaseContext _context;

        private readonly DbSet<Format> _entities;

        private readonly IFileService _fileService;

        private readonly IPreviewService _previewService;

        public FormatRepository(DatabaseContext context, IFileService fileService, IPreviewService previewService)
        {
            _context = context;
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
            await _context.SaveChangesAsync();

            return Result.Success(result.Value);
        }

        public async Task<Result<Format?>> GetMetaDataAsync(Guid fileId)
        {
            Format? result = await _entities.FirstOrDefaultAsync(x => x.FileId == fileId);

            if (result == null)
            {
                return Result.Failure<Format>("Metadata not found");
            }

            return result;
        }

        public async Task<Result<(FileModel?, Format?)>> GetByIdWithMetaData(Guid fileId)
        {
            var files = await _context.Files.AsNoTracking()
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

                return Result.Success<(FileModel?, Format?)>(new(files[0].File, files[0].Meta));
            }

            return Result.Failure<(FileModel?, Format?)>("File not found");
        }

        public async Task SaveChanges(Format format)
        {
            _context.Entry(format).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}