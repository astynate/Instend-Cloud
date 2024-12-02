using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using Microsoft.EntityFrameworkCore;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Messenger.Group;
using Instend.Core.Models.Messenger.Message;

namespace Instend.Repositories.Messenger
{
    public class GroupsRepository : IGroupsRepository
    {
        private readonly MessagesContext _messagesContext;

        private readonly IFileService _fileService;

        private readonly IAccountsRepository _accountRespository;

        private readonly IMessengerRepository _messengerRepository;

        private readonly IImageService _imageService;

        public GroupsRepository
        (
            MessagesContext messagesContext, 
            IFileService fileService, 
            IImageService imageService,
            IAccountsRepository accountsRepository,
            IMessengerRepository messengerRepository
        )
        {
            _messagesContext = messagesContext;
            _fileService = fileService;
            _imageService = imageService;
            _accountRespository = accountsRepository;
            _messengerRepository = messengerRepository;
        }

        public async Task<Result<Group>> Create(string name, byte[] avatar, Guid ownerId)
        {
            var result = Group.Create(name, ownerId);
            var account = await _accountRespository.GetByIdAsync(ownerId);

            if (account == null)
                return Result.Failure<Group>("User not found");

            if (result.IsFailure)
                return result;

            result.Value.Members.Add(account);

            await _messagesContext.AddAsync(result.Value);
            await _messagesContext.SaveChangesAsync();
            await _fileService.WriteFileAsync(result.Value.AvatarPath, avatar);

            return result;
        }

        public async Task<List<GroupMember>> GetUserGroups(Guid userId, int count)
        {
            var groups = await _messagesContext.GroupMembers
                .Where(x => x.AccountId == userId)
                .Include(x => x.Group)
                .Skip(count)
                .Take(1)
                .ToListAsync();

            return groups;
        }

        public async Task<Group?> GetGroup(Guid id, Guid userId, int from, int count)
        {
            var members = await _messagesContext.GroupMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id && x.AccountId == userId);

            if (members == null) 
                return null;

            var result = await _messagesContext.Groups
                .Where(x => x.Id == id)
                .Include(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                .Skip(from)
                .Take(count)
                .OrderByDescending(x => x.Date)
                .Include(x => x.Members)
                .FirstOrDefaultAsync();

            return result;
        }

        public async Task<Result<(Guid[] membersToAdd, Guid[] membersToDelete)>> SetGroupMembers(Guid id, Guid[] users)
        {
            var members = await _messagesContext.GroupMembers
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

            _messagesContext.GroupMembers.RemoveRange(members);

            foreach (var user in membersToAdd)
            {
                await _messagesContext.GroupMembers.AddAsync(new GroupMember(id, user));
            }

            await _messagesContext.SaveChangesAsync(); 

            return Result.Success((membersToAdd, membersToDelete));
        }

        public async Task<Result<object>> SendMessage(Guid userId, Guid groupId, string text)
        {
            var group = await GetGroup(groupId, userId, 0, 1);

            if (group == null)
                return Result.Failure<Group>("Group not found");

            var messageModel = Message.Create(text, userId);

            if (messageModel.IsFailure)
                return Result.Failure<Group>(messageModel.Error);

            group.Messages.Add(messageModel.Value);

            await _messagesContext.SaveChangesAsync();

            return group;
        }

        public Task<List<Group>> GetAccountGroups(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<Group?> GetByIdAsync(Guid id, Guid userId, int from, int count)
        {
            throw new NotImplementedException();
        }
    }
}