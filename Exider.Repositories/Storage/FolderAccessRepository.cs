using CSharpFunctionalExtensions;
using Exider.Core;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Storage
{
    public class FolderAccessRepository : IFolderAccessRepository
    {
        private readonly DatabaseContext _context;

        public FolderAccessRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<bool> GetUserAccess(Guid userId, Guid folderId)
        {
            return await _context.FolderAccesses.FirstOrDefaultAsync(x => x.UserId == userId &&
                x.FolderId == folderId) != null;
        }

        public async Task<Result> OpenAccess(Guid userId, Guid folderId)
        {
            var file = Core.Models.Storage.FolderAccess.Create
            (
                folderId,
                userId
            );

            if (file.IsFailure)
            {
                return Result.Failure("Unable to create access request");
            }

            await _context.FolderAccesses.AddAsync(file.Value);
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        public async Task CloseAccess(Guid userId, Guid folderId)
        {
            await _context.FolderAccesses.Where(x => x.UserId == userId
                && x.FolderId == folderId).ExecuteDeleteAsync();
        }
    }
}