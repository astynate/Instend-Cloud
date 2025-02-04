using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Messenger.Group;
using Instend.Core.Models.Messenger.Message;
using Instend.Core.Models.Abstraction;
using Instend.Core;
using Instend.Core.Models.Messenger.Direct;

namespace Instend.Repositories.Messenger
{
    public class GroupsRepository : IGroupsRepository
    {
        private readonly GlobalContext _context;

        private readonly IFileService _fileService;

        private readonly IAccountsRepository _accountRespository;

        private readonly IMessengerRepository _messengerRepository;

        private readonly IImageService _imageService;

        public GroupsRepository
        (
            GlobalContext context, 
            IFileService fileService, 
            IImageService imageService,
            IAccountsRepository accountsRepository,
            IMessengerRepository messengerRepository
        )
        {
            _context = context;
            _fileService = fileService;
            _imageService = imageService;
            _accountRespository = accountsRepository;
            _messengerRepository = messengerRepository;
        }

        public async Task<Result<Group>> Create(string name, byte[] avatar, string type, Guid ownerId)
        {
            var result = Group.Create(name, type);
            var account = await _accountRespository.GetByIdAsync(ownerId);

            if (account == null)
                return Result.Failure<Group>("User not found");

            if (result.IsFailure)
                return result;

            var owner = new GroupMember
            (
                Configuration.GroupRoles.Owner, 
                result.Value.Id, 
                ownerId
            );

            result.Value.Members.Add(owner);

            await _context.AddAsync(result.Value);
            await _context.SaveChangesAsync();
            await _fileService.WriteFileAsync(result.Value.AvatarPath, avatar);

            return result;
        }

        public async Task<List<Group>> GetAccountGroups(Guid accountId, int skip, int take)
        {
            var groups = await _context.GroupMembers
                .Where(x => x.AccountId == accountId)
                .Skip(skip)
                .Take(take)
                .Include(x => x.Group)
                    .ThenInclude(g => g.Messages
                        .Where(m => m.Date < DateTime.Now)
                        .OrderByDescending(m => m.Date)
                        .Take(1))
                        .ThenInclude(x => x.Sender)
                    .Select(x => x.Group)
                .ToListAsync();

            return groups;
        }

        public async Task<Group?> GetByIdAsync(Guid id, Guid userId, DateTime date, int countMessages)
        {
            var members = await _context.GroupMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.GroupId == id && x.AccountId == userId);

            if (members == null) 
                return null;

            var result = await _context.Groups
                .Where(x => x.Id == id)
                .AsSplitQuery()
                .Include(x => x.Members)
                .Include(x => x.Messages
                    .Where(x => x.Date < date)
                    .OrderByDescending(x => x.Date)
                    .Take(countMessages))
                    .ThenInclude(x => x.Attachments)
                .AsSplitQuery()
                .Include(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                .FirstOrDefaultAsync();

            return result;
        }

        public async Task<Result<(Guid[] membersToAdd, Guid[] membersToDelete)>> SetGroupMembers(Guid id, Guid[] users)
        {
            var members = await _context.GroupMembers
                .Where(x => x.GroupId == id).ToArrayAsync();

            if (members == null)
                return Result.Failure<(Guid[] membersToAdd, Guid[] membersToDelete)>("Members not found");

            var membersToDelete = members
                .Select(x => x.AccountId)
                .Except(users)
                .ToArray();

            var membersToAdd = users
                .Except(members
                .Select(x => x.AccountId))
                .ToArray();

            _context.GroupMembers.RemoveRange(members);

            await _context.SaveChangesAsync(); 

            return Result.Success((membersToAdd, membersToDelete));
        }

        public async Task<Result<DatabaseModel>> SendMessage(Guid groupId, Guid userId, string text)
        {
            var group = await GetByIdAsync(groupId, userId, DateTime.Now, 1);

            if (group == null)
                return Result.Failure<DatabaseModel>("Group not found");

            var messageModel = Message.Create(text, userId);

            if (messageModel.IsFailure)
                return Result.Failure<DatabaseModel>(messageModel.Error);

            _context.Attach(group);
            await _context.AddAsync(messageModel.Value);

            group.Messages.Add(messageModel.Value);

            await _context.SaveChangesAsync();

            return group;
        }

        public Task<List<Group>> GetAccountGroups(Guid id)
            => GetAccountGroups(id, 0, int.MaxValue);

        public async Task<Result> DeleteGroupAsync(Guid id, Guid accountId)
        {
            var group = await _context.Groups
                .Where(x => x.Id == id)
                .Include(x => x.Members)
                .Include(x => x.Messages)
                    .ThenInclude(x => x.Attachments)
                .FirstOrDefaultAsync();

            if (group == null)
                return Result.Failure("Group not found");

            if (group.Members.Where(x => x.AccountId == accountId).Any() == false)
                return Result.Failure("You hav not permissions to perform this operation");
            
            var attachments = group.Messages.SelectMany(x => x.Attachments);

            _context.RemoveRange(attachments);
            _context.RemoveRange(group.Messages);;
            _context.Groups.Remove(group);

            await _context.SaveChangesAsync();

            return Result.Success();
        }
    }
}