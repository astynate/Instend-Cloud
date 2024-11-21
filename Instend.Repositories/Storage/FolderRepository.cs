using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Storage;
using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Storage
{
    public class FolderRepository : IFolderRepository
    {
        private readonly IPreviewService _previewService = null!;

        private readonly DatabaseContext _context = null!;
       
        private readonly Func<FolderModel, bool> IsSystemFolder = (FolderModel folder) => folder.TypeId == Configuration.FolderTypes.System.ToString();
        
        private readonly Func<FolderModel, Guid, bool> IsUserOwner = (FolderModel folder, Guid userId) => folder.OwnerId == userId;

        private readonly Func<FolderModel, Guid, bool> IsIdEquals = (folder, id) => folder.Id == id;

        private readonly Func<FolderModel, string, bool> IsNameEquals = (folder, name) => folder.Name == name;

        public FolderRepository(IPreviewService previewService, DatabaseContext context)
        {
            _previewService = previewService;
            _context = context;
        }

        public async Task<FolderModel[]> GetFoldersByUserId(Guid userId)
            => await _context.Folders.AsNoTracking().Where(x => x.OwnerId == userId).ToArrayAsync();

        public async Task<FolderModel[]> GetSystemFolders(Guid userId)
            => await _context.Folders.AsNoTracking().Where(x => x.OwnerId == userId && x.TypeId == Configuration.FolderTypes.System.ToString()).ToArrayAsync();

        public async Task<FolderModel?> GetSystemFolder(string name, Guid userId) 
            => await _context.Folders.AsNoTracking().FirstOrDefaultAsync((folder) => IsNameEquals(folder, name) && IsSystemFolder(folder) && IsUserOwner(folder, userId));

        public async Task<FolderModel?> GetByIdAsync(Guid id, Guid userId) 
            => await _context.Folders.AsNoTracking().FirstOrDefaultAsync(folder => IsIdEquals(folder, id) && (id == Guid.Empty ? IsUserOwner(folder, userId) : true));

        public async Task<Result<FolderModel>> AddAsync(string name, Guid ownerId, Guid folderId, Configuration.FolderTypes folderType, bool visibility)
        {
            var folderCreationResult = FolderModel.Create(name, ownerId, folderId, folderType, visibility);

            if (folderCreationResult.IsFailure)
                return Result.Failure<FolderModel>(folderCreationResult.Error);

            await _context.Folders.AddAsync(folderCreationResult.Value);
            await _context.SaveChangesAsync();

            return Result.Success(folderCreationResult.Value);
        }

        public async Task<Result<FolderModel>> AddAsync(string name, Guid ownerId, Guid folderId)
        {
            var folderCreationResult = FolderModel.Create(name, ownerId, folderId);

            if (folderCreationResult.IsFailure)
                return Result.Failure<FolderModel>(folderCreationResult.Error);

            await _context.Folders.AddAsync(folderCreationResult.Value);
            await _context.SaveChangesAsync();

            return Result.Success(folderCreationResult.Value);
        }

        public async Task<FolderModel[]> GetFoldersByFolderId(Guid userId, Guid folderId)
        {
            var IsUserOwner = (FolderModel folder) => folder.FolderId == folderId;
            var IsFolderIdEquals = (FolderModel folder) => folder.FolderId == folderId;
            var IsTargetFolder = (FolderModel folder) => IsFolderIdEquals(folder) && (userId == Guid.Empty ? IsUserOwner(folder) : true);

            var folders = await _context.Folders
                .AsNoTracking()
                .Where(folder => IsTargetFolder(folder))
                .ToArrayAsync();

            return folders;
        }

        public async Task<FolderModel[]> GetShortPath(Guid folderId)
        {
            var path = new List<FolderModel>();
            var current = folderId;

            for (int i = 0; i < 5; i++)
            {
                var folder = await _context.Folders.FirstOrDefaultAsync(x => x.Id == current);

                if (folder == null || folder.Id == Guid.Empty)
                    break;

                current = folder.FolderId;
                path.Add(folder);
            }

            path.Reverse();

            return path.ToArray();
        }

        public async Task Delete(Guid id) 
            => await _context.Folders.Where(x => x.Id == id).ExecuteDeleteAsync();

        public async Task UpdateName(Guid id, string name) 
            => await _context.Folders.Where(x => x.Id == id).ExecuteUpdateAsync(property => property.SetProperty(x => x.Name, name));
    }
}