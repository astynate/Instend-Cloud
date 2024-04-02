using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Storage;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Storage
{
    public class FolderRepository : IFolderRepository
    {
        private readonly DatabaseContext _context = null!;

        public FolderRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<FolderModel> GetByIdAsync(Guid id) => await _context.Folders.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id) ?? throw new Exception("Not found");

        public async Task<Result> AddAsync(string name, Guid ownerId, Guid folderId)
        {
            var folderCreationResult = FolderModel.Create(name, ownerId, folderId);

            if (folderCreationResult.IsFailure == true)
            {
                return Result.Failure(folderCreationResult.Error);
            }

            await _context.Folders.AddAsync(folderCreationResult.Value);
            return Result.Success();
        }

        public async Task<FolderModel[]> GetByFolderId(Guid userId, Guid folderId)
        {
            return await _context.Folders.AsNoTracking()
                .Where(x => x.FolderId == folderId && x.OwnerId == userId).ToArrayAsync();
        }

    }
}
