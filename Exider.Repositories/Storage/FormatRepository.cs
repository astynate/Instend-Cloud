using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Formats;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Storage
{
    public class FormatRepository<Format> : IFormatRepository<Format> where Format : FormatBase, new()
    {
        private readonly DatabaseContext _context;

        private readonly DbSet<Format> _entities;

        public FormatRepository(DatabaseContext context)
        {
            _context = context;
            _entities = context.Set<Format>();
        }

        public async Task<Result> AddAsync(IFileService fileService, Guid fileId, byte[] file)
        {
            var result = await FormatBase.Create<Format>(fileService, fileId, file);

            if (result.IsFailure)
            {
                return Result.Failure("This format is not supported");
            }

            await _entities.AddAsync(result.Value);
            await _context.SaveChangesAsync();

            return Result.Success();
        }
    }
}