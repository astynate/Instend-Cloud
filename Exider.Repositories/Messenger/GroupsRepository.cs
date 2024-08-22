using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Links;
using Exider.Core.Models.Messenger;
using Exider.Core.TransferModels;
using Exider.Core.TransferModels.Account;
using Exider.Repositories.Account;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Exider.Repositories.Messenger
{
    public class GroupsRepository : IGroupsRepository
    {
        private readonly DatabaseContext _context;

        private readonly IFileService _fileService;

        private readonly IUserDataRepository _userDateRepository;

        private readonly IImageService _imageService;

        public GroupsRepository(DatabaseContext context, IFileService fileService, IUserDataRepository userDataRepository, IImageService imageService)
        {
            _context = context;
            _fileService = fileService;
            _userDateRepository = userDataRepository;
            _imageService = imageService;
        }

        public async Task<Result<GroupModel>> Create(string name, byte[] avatar, Guid ownerId)
        {
            var result = GroupModel.Create(name, ownerId);

            if (result.IsFailure)
            {
                return result;
            }

            var member = LinkBase.Create<GroupMemberLink>(result.Value.Id, ownerId);

            if (member.IsFailure)
            {
                return Result.Failure<GroupModel>(member.Error);
            }

            await _context.AddAsync(result.Value);
            await _context.AddAsync(member.Value);

            await _context.SaveChangesAsync();
            await _fileService.WriteFileAsync(result.Value.AvatarPath, avatar);

            return result;
        }

        public async Task<GroupTransferModel[]> GetUserGroups(Guid userId, int count)
        {
            var groups = await _context.GroupMemberLink
                .Where(x => x.LinkedItemId == userId)
                .Skip(count)
                .Take(1)
                .Join(_context.Groups,
                    (link) => link.ItemId,
                    (group) => group.Id,
                    (link, group) => group)
                .GroupJoin(_context.GroupMemberLink,
                    (group) => group.Id,
                    (link) => link.ItemId,
                    (group, link) => new { group, link })
                .ToArrayAsync();

            GroupTransferModel[] resultGroups = new GroupTransferModel[groups.Length];

            for (int i = 0; i < groups.Length; i++)
            {
                var users = groups[i].link.ToArray();
                groups[i].group.Members = new UserPublic[users.Length];

                for (int k = 0; k < users.Length; k++)
                {
                    var result = await _userDateRepository.GetUserAsync(users[k].LinkedItemId);

                    if (result.IsFailure)
                    {
                        return [];
                    }

                    result.Value.Header = null;
                    groups[i].group.Members[k] = result.Value;
                }

                var avatar = await _fileService.ReadFileAsync(groups[i].group.AvatarPath);

                if (avatar.IsSuccess)
                {
                    groups[i].group.Avatar = _imageService.CompressImage(avatar.Value, 2, "jpg");
                }

                resultGroups[i] = new GroupTransferModel();

                resultGroups[i].groupModel = groups[i].group;
                resultGroups[i].messageModel = null;
                resultGroups[i].userPublic = null;
            }

            return resultGroups;
        }

        public async Task<GroupTransferModel?> GetGroup(Guid id, Guid userId)
        {
            var isUserIsMember = _context.GroupMemberLink
                .FirstOrDefaultAsync(x => x.ItemId == id && x.LinkedItemId == userId);

            if (isUserIsMember == null)
            {
                return null;
            }

            var result = await _context.Groups
                .FirstOrDefaultAsync(x => x.Id == id);

            if (result == null)
            {
                return null;
            }

            GroupTransferModel groupTransferModel = new GroupTransferModel();

            var avatar = await _fileService.ReadFileAsync(result.AvatarPath);

            if (avatar.IsSuccess)
            {
                result.Avatar = _imageService.ResizeImageToBase64(avatar.Value, 5);
            }

            groupTransferModel.groupModel = result;

            return groupTransferModel;
        }

        public async Task<Result<(Guid[] membersToAdd, Guid[] membersToDelete)>> SetGroupMembers(Guid id, Guid[] users)
        {
            return await _context.Database.CreateExecutionStrategy().ExecuteAsync(async Task<Result<(Guid[] membersToAdd, Guid[] membersToDelete)>> () =>
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    GroupMemberLink[] members = await _context.GroupMemberLink
                        .Where(x => x.ItemId == id).ToArrayAsync();

                    if (members == null)
                    {
                        return Result.Failure<(Guid[] membersToAdd, Guid[] membersToDelete)>("Members not found");
                    }

                    Guid[] membersToDelete = members
                        .SelectMany(x => new[] { x.LinkedItemId })
                        .Except(users)
                        .ToArray();

                    Guid[] membersToAdd = users
                        .Except(members
                        .SelectMany(x => new[] { x.LinkedItemId }))
                        .ToArray();

                    await _context.GroupMemberLink
                        .Where(x => membersToDelete.Contains(x.LinkedItemId))
                        .ExecuteDeleteAsync();

                    foreach (var user in membersToAdd)
                    {
                        var link = LinkBase.Create<GroupMemberLink>(id, user);

                        if (link.IsFailure)
                        {
                            transaction.Rollback();
                            return Result.Failure<(Guid[] membersToAdd, Guid[] membersToDelete)>(link.Error);
                        }

                        await _context.GroupMemberLink.AddAsync(link.Value);
                    }

                    await _context.SaveChangesAsync(); transaction.Commit();

                    return Result.Success((membersToAdd, membersToDelete));
                }
            });
        }
    }
}