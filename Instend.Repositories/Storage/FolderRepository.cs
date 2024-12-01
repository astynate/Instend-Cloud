using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Storage.Collection;
using Instend.Repositories.Contexts;
using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Storage
{
    public class FolderRepository : IFolderRepository
    {
        private readonly IPreviewService _previewService = null!;

        private readonly StorageContext _storageContext = null!;
       
        private readonly Func<Collection, bool> IsSystemFolder = (Collection folder) => folder.TypeId == Configuration.CollectionTypes.System.ToString();
        
        private readonly Func<Collection, Guid, bool> IsUserOwner = (Collection folder, Guid userId) => folder.AccountId == userId;

        private readonly Func<Collection, Guid, bool> IsIdEquals = (folder, id) => folder.Id == id;

        private readonly Func<Collection, string, bool> IsNameEquals = (folder, name) => folder.Name == name;

        public FolderRepository(IPreviewService previewService, StorageContext storageContext)
        {
            _previewService = previewService;
            _storageContext = storageContext;
        }

        public async Task<Collection[]> GetFoldersByUserId(Guid userId)
            => await _storageContext.Folders.AsNoTracking().Where(x => x.AccountId == userId).ToArrayAsync();

        public async Task<Collection[]> GetSystemFolders(Guid userId)
            => await _storageContext.Folders.AsNoTracking().Where(x => x.AccountId == userId && x.TypeId == Configuration.CollectionTypes.System.ToString()).ToArrayAsync();

        public async Task<Collection?> GetSystemFolder(string name, Guid userId) 
            => await _storageContext.Folders.AsNoTracking().FirstOrDefaultAsync((folder) => IsNameEquals(folder, name) && IsSystemFolder(folder) && IsUserOwner(folder, userId));

        public async Task<Collection?> GetByIdAsync(Guid id, Guid userId) 
            => await _storageContext.Folders.AsNoTracking().FirstOrDefaultAsync(folder => IsIdEquals(folder, id) && (id == Guid.Empty ? IsUserOwner(folder, userId) : true));

        public async Task<Result<Collection>> AddAsync(string name, Guid ownerId, Guid folderId, Configuration.CollectionTypes folderType, bool visibility)
        {
            var folderCreationResult = Collection.Create(name, ownerId, folderId, folderType, visibility);

            if (folderCreationResult.IsFailure)
                return Result.Failure<Collection>(folderCreationResult.Error);

            await _storageContext.Folders.AddAsync(folderCreationResult.Value);
            await _storageContext.SaveChangesAsync();

            return Result.Success(folderCreationResult.Value);
        }

        public async Task<Result<Collection>> AddAsync(string name, Guid ownerId, Guid folderId)
        {
            var folderCreationResult = Collection.Create(name, ownerId, folderId);

            if (folderCreationResult.IsFailure)
                return Result.Failure<Collection>(folderCreationResult.Error);

            await _storageContext.Folders.AddAsync(folderCreationResult.Value);
            await _storageContext.SaveChangesAsync();

            return Result.Success(folderCreationResult.Value);
        }

        public async Task<Collection[]> GetFoldersByFolderId(Guid userId, Guid folderId)
        {
            var IsUserOwner = (Collection folder) => folder.FolderId == folderId;
            var IsFolderIdEquals = (Collection folder) => folder.FolderId == folderId;
            var IsTargetFolder = (Collection folder) => IsFolderIdEquals(folder) && (userId == Guid.Empty ? IsUserOwner(folder) : true);

            var folders = await _storageContext.Folders
                .AsNoTracking()
                .Where(folder => IsTargetFolder(folder))
                .ToArrayAsync();

            return folders;
        }

        public async Task<Collection[]> GetShortPath(Guid folderId)
        {
            var path = new List<Collection>();
            var current = folderId;

            for (int i = 0; i < 5; i++)
            {
                var folder = await _storageContext.Folders.FirstOrDefaultAsync(x => x.Id == current);

                if (folder == null || folder.Id == Guid.Empty)
                    break;

                current = folder.FolderId;
                path.Add(folder);
            }

            path.Reverse();

            return path.ToArray();
        }

        public async Task Delete(Guid id) 
            => await _storageContext.Folders.Where(x => x.Id == id).ExecuteDeleteAsync();

        public async Task UpdateName(Guid id, string name) 
            => await _storageContext.Folders.Where(x => x.Id == id).ExecuteUpdateAsync(property => property.SetProperty(x => x.Name, name));
    }
}