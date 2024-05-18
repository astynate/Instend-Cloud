using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Formats;
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

        public async Task<Result<object>> GetMetaDataAsync(Guid fileId)
        {
            Format? result = await _entities.FirstOrDefaultAsync(x => x.FileId == fileId);

            if (result == null)
            {
                return Result.Failure("Metadata not found");
            }

            return result;
        }
    }
}