using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Exider.Core;
using Exider.Core.Dependencies.Repositories.Storage;
using Exider.Core.Models.Links;
using Exider.Core.Models.Messages;
using Exider.Core.Models.Messenger;
using Exider.Core.TransferModels;
using Exider.Core.TransferModels.Account;
using Exider.Repositories.Account;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Messenger
{
    public class DirectRepository : IDirectRepository
    {
        private readonly DatabaseContext _context = null!;

        private readonly IUserDataRepository _userData;

        private readonly IMessengerRepository _messengerRepository;

        private readonly IAttachmentsRepository<MessageAttachmentLink> _attachmentRepository;

        public DirectRepository
        (
            DatabaseContext context,
            IUserDataRepository userData,
            IAttachmentsRepository<MessageAttachmentLink> attachmentsRepository,
            IMessengerRepository messengerRepository

        )
        {
            _context = context;
            _userData = userData;
            _attachmentRepository = attachmentsRepository;
            _messengerRepository = messengerRepository;
        }

        public async Task<Result<DirectTransferModel>> CreateNewDirect(Guid userId, Guid ownerId)
        {
            var directModel = DirectModel.Create(userId, ownerId);

            if (directModel.IsFailure)
            {
                return Result.Failure<DirectTransferModel>("Failed to create chat");
            }

            var user = await _userData.GetUserAsync(ownerId);

            if (user.IsFailure)
            {
                return Result.Failure<DirectTransferModel>(user.Error);
            }

            await _context.Directs.AddAsync(directModel.Value);
            await _context.SaveChangesAsync();

            return new DirectTransferModel(directModel.Value, null, user.Value);
        }

        public async Task<Result<Guid>> DeleteDirect(Guid destination, Guid userId)
        {
            DirectModel? direct = await _context.Directs
                .FirstOrDefaultAsync(x => (x.UserId == userId && x.OwnerId == destination) ||
                                          (x.OwnerId == userId && x.UserId == destination));

            if (direct == null)
            {
                return Result.Failure<Guid>("Direct not found");
            }

            _context.Directs.Remove(direct);
            await _context.SaveChangesAsync();

            return Result.Success(direct.Id);
        }

        public async Task<MessageModel[]> GetLastMessages(Guid destination, Guid userId, int from, int count)
        {
            var messages = await _context.Directs.AsNoTracking()
                .Where(direct => (direct.UserId == userId && direct.OwnerId == destination) || (direct.OwnerId == userId && direct.UserId == destination))
                .Join(_context.DirectLinks,
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

            foreach(var message in messages)
            {
                await _messengerRepository.SetAttachments(message);
            }

            return messages;
        }

        public async Task<Result<MessengerTransferModelBase>> SendMessage(Guid ownerId, Guid userId, string text)
        {
            DirectTransferModel? direct = await _context.Directs.AsNoTracking()
                .Where(direct => (direct.UserId == userId && direct.OwnerId == ownerId) || (direct.OwnerId == userId && direct.UserId == ownerId))
                .Join(_context.Users,
                    direct => direct.OwnerId == userId ? direct.UserId : direct.OwnerId,
                    user => user.Id,
                    (direct, user) => new 
                    {
                        direct,
                        user,
                    })
                .Join(_context.UserData,
                    prev => prev.user.Id,
                    user => user.UserId,
                    (prev, userData) => new DirectTransferModel
                    (
                        prev.direct,
                        null,
                        new UserPublic
                        {
                            Id = prev.user.Id,
                            Name = prev.user.Name,
                            Surname = prev.user.Surname,
                            Nickname = prev.user.Nickname,
                            Email = prev.user.Email,
                            Avatar = userData.Avatar,
                            Header = userData.Header,
                            Description = userData.Description,
                            StorageSpace = userData.StorageSpace,
                            OccupiedSpace = userData.OccupiedSpace,
                            Balance = userData.Balance,
                            FriendCount = userData.FriendCount
                        }
                    ))
                .FirstOrDefaultAsync();

            return await _context.Database.CreateExecutionStrategy().ExecuteAsync(async Task<Result<MessengerTransferModelBase>> () =>
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    if (direct == null)
                    {
                        var newDirect = await CreateNewDirect(userId, ownerId);

                        if (newDirect.IsFailure)
                        {
                            return Result.Failure<MessengerTransferModelBase>(newDirect.Error);
                        }

                        direct = newDirect.Value;
                        direct.isChatCreated = true;
                    }
                    else if (direct.model.IsAccepted == false)
                    {
                        return Result.Failure<MessengerTransferModelBase>("Invite is not accepted");
                    }

                    var messageModel = MessageModel.Create(text, ownerId);

                    if (messageModel.IsFailure)
                    {
                        return Result.Failure<MessengerTransferModelBase>(messageModel.Error);
                    }

                    var link = LinkBase.Create<DirectMessageLink>(direct.model.Id, messageModel.Value.Id);

                    if (link.IsFailure)
                    {
                        return Result.Failure<MessengerTransferModelBase>(link.Error);
                    }

                    await _context.DirectLinks.AddAsync(link.Value);
                    await _context.SaveChangesAsync();

                    await _context.Messages.AddAsync(messageModel.Value);
                    await _context.SaveChangesAsync();

                    direct.messageModel = messageModel.Value;
                    transaction.Commit();

                    return direct;
                }
            });
        }
    }
}