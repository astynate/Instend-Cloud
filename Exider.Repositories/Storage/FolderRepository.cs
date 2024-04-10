using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;
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

        public async Task<FolderModel?> GetByIdAsync(Guid id)
            => await _context.Folders.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
         
        public async Task<Result<FolderModel>> AddAsync(string name, Guid ownerId, Guid folderId)
        {
            var folderCreationResult = FolderModel.Create(name, ownerId, folderId);

            if (folderCreationResult.IsFailure)
            {
                return Result.Failure<FolderModel>(folderCreationResult.Error);
            }

            await _context.Folders.AddAsync(folderCreationResult.Value);
            await _context.SaveChangesAsync();

            return Result.Success(folderCreationResult.Value);
        }

        public async Task<FolderModel[]> GetFoldersByFolderId(IFileService fileService, Guid userId, Guid folderId)
        {
            FolderModel[] folders;

            if (folderId == Guid.Empty)
            {
                folders = await _context.Folders.AsNoTracking()
                    .Where(x => x.FolderId == folderId && x.OwnerId == userId).ToArrayAsync();
            }
            else
            {
                folders = await _context.Folders.AsNoTracking()
                    .Where(x => x.FolderId == folderId).ToArrayAsync();
            }

            foreach (var folder in folders)
            {
                await folder.SetPreviewAsync(fileService, await _context.Files.AsNoTracking().Take(4)
                    .Where(x => x.FolderId == folder.Id).ToListAsync());
            }

            return folders;
        }

        public async Task<FolderModel[]> GetShortPath(Guid folderId)
        {
            List<FolderModel> path = [];
            Guid current = folderId;

            for (int i = 0; i < 5; i++)
            {
                FolderModel? folder = await _context.Folders.FirstOrDefaultAsync(x => x.Id == current);

                if (folder == null || folder.Id == Guid.Empty)
                {
                    break;
                }

                current = folder.FolderId;
                path.Add(folder);
            }

            path.Reverse();

            return path.ToArray();
        }

        public async Task Delete(Guid id)
        {
            await _context.Folders.Where(x => x.Id == id)
                .ExecuteDeleteAsync();
        }

        public async Task UpdateName(Guid id, string name)
        {
            await _context.Folders.Where(x => x.Id == id)
                .ExecuteUpdateAsync(property => property.SetProperty(x => x.Name, name));
        }

        public async Task<FolderModel[]> GetFoldersByUserId(Guid userId)
        {
            return await _context.Folders.AsNoTracking()
                .Where(x => x.OwnerId == userId).ToArrayAsync();
        }
    }
}