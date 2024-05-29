using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Links;
using Exider.Core.Models.Messages;
using Exider.Core.Models.Messenger;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Messenger
{
    public class DirectRepository : IDirectRepository
    {
        private readonly DatabaseContext _context = null!;

        public DirectRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Result<DirectModel>> CreateNewDiret(Guid userId, Guid ownerId)
        {
            var directModel = DirectModel.Create(userId, ownerId);

            if (directModel.IsFailure)
            {
                return Result.Failure<DirectModel>("Failed to create chat");
            }

            await _context.Directs.AddAsync(directModel.Value);
            await _context.SaveChangesAsync();

            return directModel.Value;
        }

        public async Task<Result<(MessageModel, DirectModel)>> SendMessage(Guid ownerId, Guid userId, string text)
        {
            DirectModel? direct = await _context.Directs.AsNoTracking()
                .FirstOrDefaultAsync(direct => (direct.UserId == userId && direct.OwnerId == ownerId) ||
                   (direct.OwnerId == userId && direct.UserId == ownerId));

            if (direct == null)
            {
                var newDirect = await CreateNewDiret(ownerId, userId);

                if (newDirect.IsFailure)
                {
                    return Result.Failure<(MessageModel, DirectModel)>(newDirect.Error);
                }

                direct = newDirect.Value;
            }

            var messageModel = MessageModel.Create(text, userId);

            if (messageModel.IsFailure)
            {
                return Result.Failure<(MessageModel, DirectModel)>(messageModel.Error);
            }

            var link = LinkBase.Create<DirectMessageLink>(direct.Id, messageModel.Value.Id);

            if (link.IsFailure)
            {
                return Result.Failure<(MessageModel, DirectModel)>(link.Error);
            }

            await _context.Messages.AddAsync(messageModel.Value);
            await _context.DirectLinks.AddAsync(link.Value);
            await _context.SaveChangesAsync();

            return (messageModel.Value, direct);
        }

        private bool IsValidDirect(DirectModel direct, Guid userId, Guid ownerId)
        {
            return (direct.UserId == userId && direct.OwnerId == ownerId) ||
                   (direct.OwnerId == userId && direct.UserId == ownerId);
        }
    }
}