using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Instend.Core;
using Instend.Core.Dependencies.Repositories.Storage;
using Instend.Core.Models.Messages;
using Instend.Core.Models.Messenger;
using Instend.Core.TransferModels.Account;
using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Links;
using Microsoft.EntityFrameworkCore;
using Instend.Core.TransferModels.Messenger;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Models.Account;

namespace Instend.Repositories.Messenger
{
    public class GroupsRepository : IGroupsRepository
    {
        private readonly DatabaseContext _context;

        private readonly IFileService _fileService;

        private readonly IAccountsRepository _accountRespository;

        private readonly IAttachmentsRepository<MessageAttachmentLink> _attachmentsRepository;

        private readonly IMessengerRepository _messengerRepository;

        private readonly IImageService _imageService;

        public GroupsRepository
        (
            DatabaseContext context, 
            IFileService fileService, 
            IImageService imageService,
            IAccountsRepository accountsRepository,
            IAttachmentsRepository<MessageAttachmentLink> attachmentsRepository,
            IMessengerRepository messengerRepository
        )
        {
            _context = context;
            _fileService = fileService;
            _imageService = imageService;
            _accountRespository = accountsRepository;
            _attachmentsRepository = attachmentsRepository;
            _messengerRepository = messengerRepository;
        }

        public async Task<Result<GroupModel>> Create(string name, byte[] avatar, Guid ownerId)
        {
            var result = GroupModel.Create(name, ownerId);

            if (result.IsFailure)
                return result;

            var member = LinkBase.Create<GroupMemberLink>(result.Value.Id, ownerId);

            if (member.IsFailure)
                return Result.Failure<GroupModel>(member.Error);

            await _context.AddAsync(result.Value);
            await _context.AddAsync(member.Value);

            await _context.SaveChangesAsync();
            await _fileService.WriteFileAsync(result.Value.AvatarPath, avatar);

            return result;
        }

        public async Task<GroupTransferModel[]> GetUserGroups(Guid userId, int count)
        {
            var groupLinks = await _context.GroupMemberLink
                .Where(x => x.LinkedItemId == userId)
                .Skip(count)
                .Take(1)
                .ToArrayAsync();

            GroupTransferModel[] groups = new GroupTransferModel[groupLinks.Length];

            for (int i = 0; i < groupLinks.Length; i++)
            {
                groups[0] = await GetGroup(groupLinks[i].ItemId, userId) ?? new GroupTransferModel();
            }

            return groups;
        }

        public async Task<MessageModel[]> GetLastMessages(Guid destination, Guid userId, int from, int count)
        {
            var messages = await _context.Groups.AsNoTracking()
                .Where(group => group.Id == destination)
                .Join(_context.GroupMessageLink,
                    direct => direct.Id,
                    link => link.ItemId,
                    (direct, link) => new
                    {
                        direct,
                        link
                    })
                .OrderByDescending(x => x.link.Date)
                .Skip(from)
                .Take(count)
                .Join(_context.Messages,
                    prev => prev.link.LinkedItemId,
                    message => message.Id,
                    (prev, message) => message)
                .ToArrayAsync();

            foreach (var message in messages)
            {
                await _messengerRepository.SetAttachments(message);
            }

            return messages;
        }

        public async Task<GroupTransferModel?> GetGroup(Guid id, Guid userId)
        {
            var members = await _context.GroupMemberLink
                .Where(x => x.ItemId == id)
                .ToArrayAsync();

            if (members.Select(x => x.LinkedItemId).Contains(userId) == false) return null;

            var result = await _context.Groups
                .Where(x => x.Id == id)
                .GroupJoin(_context.GroupMessageLink,
                    group => group.Id,
                    link => link.ItemId,
                    (group, links) => new
                    {
                        group,
                        messageLink = links.OrderByDescending(l => l.Date).FirstOrDefault()
                    })
                .Select(prev => new GroupTransferModel()
                {
                    model = prev.group,
                    message = prev.messageLink != null ? _context.Messages
                        .FirstOrDefault(message => message.Id == prev.messageLink.LinkedItemId) : null
                })
                .FirstOrDefaultAsync();

            if (result == null || result.model == null) return null;

            result.model.Members = new AccountModel[members.Length];

            for (int i = 0; i < members.Length; i++)
            {
                var user = await _accountRespository.GetByIdAsync(members[i].LinkedItemId);

                if (user == null)
                    return null;

                result.model.Members[i] = user;
            }

            if (result.message != null)
            {
                result.message.attachments = await _attachmentsRepository
                    .GetItemAttachmentsAsync(result.message.Id);
            }

            var avatar = await _fileService.ReadFileAsync(result.model.AvatarPath);

            if (avatar.IsSuccess)
            {
                result.model.Avatar = _imageService.CompressImage(avatar.Value, 2, "jpg");
            }

            return result;
        }

        public async Task<Result<(Guid[] membersToAdd, Guid[] membersToDelete)>> SetGroupMembers(Guid id, Guid[] users)
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
                    return Result.Failure<(Guid[] membersToAdd, Guid[] membersToDelete)>(link.Error);
                }

                await _context.GroupMemberLink.AddAsync(link.Value);
            }

            await _context.SaveChangesAsync(); 

            return Result.Success((membersToAdd, membersToDelete));
        }

        public async Task<Result<MessengerTransferModelBase>> SendMessage(Guid userId, Guid groupId, string text)
        {
            GroupTransferModel? group = await GetGroup(groupId, userId);

            if (group == null)
            {
                return Result.Failure<MessengerTransferModelBase>("Group not found");
            }

            return await _context.Database.CreateExecutionStrategy().ExecuteAsync(async Task<Result<MessengerTransferModelBase>> () =>
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    var messageModel = MessageModel.Create(text, userId);

                    if (messageModel.IsFailure)
                    {
                        return Result.Failure<MessengerTransferModelBase>(messageModel.Error);
                    }

                    var link = LinkBase.Create<GroupMessageLink>(group.model.Id, messageModel.Value.Id);

                    if (link.IsFailure)
                    {
                        return Result.Failure<MessengerTransferModelBase>(link.Error);
                    }

                    await _context.Messages.AddAsync(messageModel.Value);
                    await _context.SaveChangesAsync();

                    await _context.GroupMessageLink.AddAsync(link.Value);
                    await _context.SaveChangesAsync();

                    group.message = messageModel.Value;
                    transaction.Commit();

                    return group;
                }
            });
        }
    }
}