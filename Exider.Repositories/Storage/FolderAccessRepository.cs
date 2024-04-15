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

        public async Task<object[]> GetUsersWithAccess(Guid folderId)
        {
            return await  _context.FolderAccesses
                .Where(x => x.FolderId == folderId)
                .Join(_context.Users, t1 => t1.UserId, t2 => t2.Id, (t1, t2) => new { t1, t2 })
                .Join(_context.UserData, t2 => t2.t2.Id, t3 => t3.UserId, (t2, t3) => new { Access = t2.t1, User = t2.t2, UserData = t3 })
                .ToArrayAsync();
        }

        public async Task<Result> UpdateAccessState(Configuration.AccessTypes type, Guid userId, Guid folderId)
        {
            int result = await _context.Folders
                .Where(x => x.Id == folderId && x.OwnerId == userId)
                .ExecuteUpdateAsync(folder => folder.SetProperty(p => p.AccessId, type.ToString()));

            await _context.SaveChangesAsync();

            if (result <= 0)
            {
                return Result.Failure("Folder not found");
            }

            return Result.Success();
        }

        public async Task CrearAccess(Guid folderId)
        {
            await _context.FolderAccesses.Where(x => x.FolderId == folderId).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
        }

        public async Task<Result> OpenAccess(Guid userId, Guid folderId, Configuration.Abilities ability)
        {
            var file = Core.Models.Storage.FolderAccess.Create
            (
                folderId,
                userId,
                ability
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