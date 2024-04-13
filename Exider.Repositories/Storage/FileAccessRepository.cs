using CSharpFunctionalExtensions;
using Exider.Core;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Storage
{
    public class FileAccessRepository : IFileAccessRepository
    {
        private readonly DatabaseContext _context;

        public FileAccessRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<bool> GetUserAccess(Guid userId, Guid fileId)
        {
            return await _context.FileAccess.FirstOrDefaultAsync(x => x.UserId == userId &&
                x.FileId == fileId) != null;
        }

        public async Task<Result> OpenAccess(Guid userId, Guid fileId)
        {
            var file = Core.Models.Storage.FileAccess.Create
            (
                fileId,
                userId
            );

            if (file.IsFailure)
            {
                return Result.Failure("Unable to create access request");
            }

            await _context.FileAccess.AddAsync(file.Value);
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        public async Task CloseAccess(Guid userId, Guid fileId)
        {
            await _context.FileAccess.Where(x => x.UserId == userId
                && x.FileId == fileId).ExecuteDeleteAsync();
        }
    }
}
