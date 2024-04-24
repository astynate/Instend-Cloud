using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.TransferModels;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Storage
{
    public class FolderAccessRepository : IFolderAccessRepository
    {
        private readonly DatabaseContext _context;

        private readonly IFileService _fileService;

        public FolderAccessRepository(DatabaseContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<bool> GetUserAccess(Guid userId, Guid folderId)
        {
            return await _context.FolderAccesses.FirstOrDefaultAsync(x => x.UserId == userId &&
                x.FolderId == folderId) != null;
        }

        public async Task<AccessTransferModel[]> GetUsersWithAccess(Guid folderId)
        {
            AccessTransferModel[] result = await _context.FolderAccesses
                .Where(x => x.FolderId == folderId)
                .Join(_context.Users, accessTable => accessTable.UserId, usersTable => usersTable.Id, (access, user) => new { access, user })
                .Join(_context.UserData, mergedTable => mergedTable.user.Id, data => data.UserId, (merged, data)
                    => new AccessTransferModel(merged.access, merged.user, data))
                .ToArrayAsync();

            foreach (AccessTransferModel item in result)
            {
                if (item.data.Avatar == Configuration.DefaultAvatarPath)
                {
                    item.base64Avatar = Configuration.DefaultAvatar;
                }
                else if (string.IsNullOrEmpty(item.data.Avatar) == false)
                {
                    var avatarReadingResult = await _fileService.ReadFileAsync(item.data.Avatar);
                    item.base64Avatar = Convert.ToBase64String(avatarReadingResult.Value);
                }
            }

            return result;
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