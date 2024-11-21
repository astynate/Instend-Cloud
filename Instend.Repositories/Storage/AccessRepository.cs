using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using Microsoft.EntityFrameworkCore;
using Instend.Core.TransferModels.Access;

namespace Instend.Repositories.Storage
{
    public class AccessRepository<Access, Item> : IAccessRepository<Access, Item>
        where Access : AccessBase, new()
        where Item : AccessItemBase, new()
    {
        private readonly DatabaseContext _context;

        private readonly DbSet<Access> _accessEntities;

        private readonly DbSet<Item> _itemEntities;

        private readonly IFileService _fileService;

        public AccessRepository
        (
            DatabaseContext context, 
            IFileService fileService
        )
        {
            _context = context;
            _fileService = fileService;
            _accessEntities = context.Set<Access>();
            _itemEntities = context.Set<Item>();
        }

        public async Task<bool> GetUserAccess(Guid userId, Guid folderId)
        {
            return await _accessEntities.FirstOrDefaultAsync(x => x.UserId == userId &&
                x.ItemId == folderId) != null;
        }

        public async Task<AccessTransferModel[]> GetUsersWithAccess(Guid folderId)
        {
            //AccessTransferModel[] result = await _accessEntities
            //    .Where(x => x.ItemId == folderId)
            //    .Join(_context.Users, accessTable => accessTable.UserId, usersTable => usersTable.Id, (access, user) => new { access, user })
            //    .Join(_context.UserData, mergedTable => mergedTable.user.Id, data => data.UserId, (merged, data)
            //        => new AccessTransferModel(merged.access, merged.user, data))
            //    .ToArrayAsync();

            //foreach (AccessTransferModel item in result)
            //{
            //    if (item.data.Avatar == Configuration.DefaultAvatarPath)
            //    {
            //        item.base64Avatar = Configuration.DefaultAvatar;
            //    }
            //    else if (string.IsNullOrEmpty(item.data.Avatar) == false)
            //    {
            //        var avatarReadingResult = await _fileService.ReadFileAsync(item.data.Avatar);
            //        item.base64Avatar = Convert.ToBase64String(avatarReadingResult.Value);
            //    }
            //}

            return [];
        }

        public async Task<Result> UpdateAccessState(Configuration.AccessTypes type, Guid userId, Guid folderId)
        {
            int result = await _itemEntities
                .Where(x => x.Id == folderId && x.OwnerId == userId)
                .ExecuteUpdateAsync(folder => folder.SetProperty(p => p.AccessId, type.ToString()));

            await _context.SaveChangesAsync();
            return result <= 0 ? Result.Failure("Folder not found or access denied") :  Result.Success();
        }

        public async Task CrearAccess(Guid folderId)
        {
            await _accessEntities.Where(x => x.ItemId == folderId).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
        }

        public async Task<Result> OpenAccess(Guid userId, Guid folderId, Configuration.Abilities ability)
        {
            var file = AccessBase.Create<Access>
            (
                folderId,
                userId,
                ability
            );

            if (file.IsFailure)
            {
                return Result.Failure("Unable to create access request");
            }

            await _accessEntities.AddAsync(file.Value);
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        public async Task CloseAccess(Guid userId, Guid folderId)
        {
            await _accessEntities.Where(x => x.UserId == userId
                && x.ItemId == folderId).ExecuteDeleteAsync();
        }
    }
}