using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Messenger.Group;
using Instend.Core.Models.Abstraction;
using Instend.Core;
using Instend.Core.TransferModels.Messenger;

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
                .AsSplitQuery()
                .Include(x => x.Group)
                    .ThenInclude(x => x.Messages)
                        .ThenInclude(x => x.Attachments)
                .Include(x => x.Group)
                    .ThenInclude(x => x.Messages)
                        .ThenInclude(x => x.Files)
                .Include(x => x.Group)
                    .ThenInclude(x => x.Messages)
                        .ThenInclude(x => x.Collections)
                    .Include(x => x.Group)
                        .ThenInclude(x => x.Members)
                            .ThenInclude(x => x.Account)
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
                .Include(x => x.Messages)
                    .ThenInclude(x => x.Files)
                .Include(x => x.Messages)
                    .ThenInclude(x => x.Collections)
                .FirstOrDefaultAsync();

            return result;
        }

        public async Task<Result<GroupMember[]>> AddGroupMembers(Guid id, Guid[] users)
        {
            var members = await _context.GroupMembers
                .Where(x => x.GroupId == id)
                .ToArrayAsync();

            if (members == null)
                return Result.Failure<GroupMember[]>("Members not found");

            if (members.Length + users.Length > 100)
                return Result.Failure<GroupMember[]>("Maximum number of members id 100");

            var membersToAdd = users
                .Except(members.Select(x => x.AccountId))
                .Select(x => new GroupMember(Configuration.GroupRoles.Member, id, x))
                .ToArray();

            if (membersToAdd.Length > 0)
            {
                await _context.GroupMembers.AddRangeAsync(membersToAdd);
                await _context.SaveChangesAsync();
            }

            foreach (var member in membersToAdd)
            {
                member.Account = await _accountRespository.GetByIdAsync(member.AccountId);
            }

            return membersToAdd;
        }

        public async Task<Result> RemoveMember(Group group, Guid memberId)
        {
            if (group.Members.Count() < 2)
                return Result.Failure("Can't delete member");

            var numberOfOwners = group.Members
                .Where(x => x.Role == Configuration.GroupRoles.Owner)
                .Count();

            var memberToDelete = group.Members
                .FirstOrDefault(x => x.AccountId == memberId);

            if (memberToDelete == null)
                return Result.Failure("Can't delete member");

            _context.Attach(group);

            if (numberOfOwners == 1 && memberToDelete.Role == Configuration.GroupRoles.Owner)
            {
                group.Members.Remove(memberToDelete);
                
                var firstMember = group.Members.FirstOrDefault();

                if (firstMember == null)
                    return Result.Failure("Can't delete member");

                firstMember.Role = Configuration.GroupRoles.Owner;
            }

            _context.Remove(memberToDelete);
            
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        public async Task<Result<DatabaseModel>> SendMessage(IFileService fileService, IMessengerRepository messengerRepository, MessageTransferModel message, Guid senderId)
        {
            var group = await GetByIdAsync(message.id, senderId, DateTime.Now, 1);

            if (group == null)
                return Result.Failure<DatabaseModel>("Group not found");

            var result = await messengerRepository.CreateMessage(fileService, message, senderId);

            if (result.IsFailure)
                return Result.Failure<DatabaseModel>(result.Error);

            _context.Attach(group);
            _context.Attach(result.Value);

            group.Messages.Add(result.Value);
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