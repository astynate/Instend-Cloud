using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Exider.Core;
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

        public DirectRepository(DatabaseContext context, IUserDataRepository userData)
        {
            _context = context;
            _userData = userData;
        }

        public async Task<Result<MessengerTransferModel>> CreateNewDiret(Guid userId, Guid ownerId)
        {
            var directModel = DirectModel.Create(userId, ownerId);

            if (directModel.IsFailure)
            {
                return Result.Failure<MessengerTransferModel>("Failed to create chat");
            }

            var user = await _userData.GetUserAsync(ownerId);

            if (user.IsFailure)
            {
                return Result.Failure<MessengerTransferModel>(user.Error);
            }

            await _context.Directs.AddAsync(directModel.Value);
            await _context.SaveChangesAsync();

            return new MessengerTransferModel(directModel.Value, null, user.Value);
        }

        public async Task<Result<MessengerTransferModel>> SendMessage(Guid ownerId, Guid userId, string text)
        {
            MessengerTransferModel? direct = await _context.Directs.AsNoTracking()
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
                    (prev, userData) => new MessengerTransferModel
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

            if (direct == null)
            {
                var newDirect = await CreateNewDiret(userId, ownerId);

                if (newDirect.IsFailure)
                {
                    return Result.Failure<MessengerTransferModel>(newDirect.Error);
                }

                direct = newDirect.Value;
            }

            var messageModel = MessageModel.Create(text, userId);

            if (messageModel.IsFailure)
            {
                return Result.Failure<MessengerTransferModel>(messageModel.Error);
            }

            var link = LinkBase.Create<DirectMessageLink>(direct.directModel.Id, messageModel.Value.Id);

            if (link.IsFailure)
            {
                return Result.Failure<MessengerTransferModel>(link.Error);
            }

            await _context.Messages.AddAsync(messageModel.Value);
            await _context.DirectLinks.AddAsync(link.Value);
            await _context.SaveChangesAsync();

            return direct;
        }
    }
}