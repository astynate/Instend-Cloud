using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Microsoft.EntityFrameworkCore;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Messenger.Direct;
using Instend.Core.Models.Messenger.Message;
using System.Linq.Expressions;

namespace Instend.Repositories.Messenger
{
    public class DirectRepository : IDirectRepository
    {
        private readonly GlobalContext _context = null!;

        private readonly IMessengerRepository _messengerRepository;

        private readonly IAccountsRepository _accountsRepository;

        private static readonly Func<Direct, Guid, bool> IsUserInvitor = (Direct direct, Guid userId) => direct.OwnerId == userId;

        private static readonly Func<Direct, Guid, bool> IsUserInvited = (Direct direct, Guid userId) => direct.AccountModelId == userId;

        private static readonly Func<Direct, Guid, Guid, bool> IsFirstUserOwner = (Direct d, Guid o, Guid u) => IsUserInvitor(d, o) && IsUserInvited(d, u);

        public DirectRepository
        (
            GlobalContext context,
            IAccountsRepository accountsRepository,
            IMessengerRepository messengerRepository

        )
        {
            _context = context;
            _accountsRepository = accountsRepository;
            _messengerRepository = messengerRepository;
        }

        public async Task<Result<Direct>> CreateNewDirect(Guid userId, Guid ownerId)
        {
            var direct = Direct.Create(userId, ownerId);

            if (direct.IsFailure)
                return Result.Failure<Direct>("Failed to create chat");

            var account = await _accountsRepository.GetByIdAsync(ownerId);

            await _context.Directs.AddAsync(direct.Value);
            await _context.SaveChangesAsync();

            return direct;
        }

        private async Task<List<Direct>> GetAsync(Expression<Func<Direct, bool>> function, int numberOfSkipedMessages, int countMessages)
        {
            var result = await _context.Directs
                .Where(function)
                .Include(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                .OrderByDescending(x => x.Date)
                .Skip(numberOfSkipedMessages)
                .Take(countMessages)
                .Take(1)
                .ToListAsync();

            return result;
        }

        public async Task<List<Direct>> GetAccountDirectsAsync(Guid userId)
            => await GetAsync((d) => IsUserInvitor(d, userId) || IsUserInvited(d, userId), 0, 1);

        public async Task<Direct?> GetAsync(Guid id, Guid userId, int numberOfSkipedMessages, int countMessages)
        {
            var result = await GetAsync
            (
                (d) => d.Id == id && (IsUserInvitor(d, userId) || IsUserInvited(d, userId)), 
                numberOfSkipedMessages, 
                countMessages
            );

            return result.FirstOrDefault();
        }

        public async Task<Direct?> GetByAccountIdsAsync(Guid userId, Guid ownerId, int numberOfSkipedMessages, int countMessages)
        {
            var result = await GetAsync
            (
                (d) => IsFirstUserOwner(d, userId, ownerId) || IsFirstUserOwner(d, ownerId, userId), 
                numberOfSkipedMessages, 
                countMessages
            );

            return result.FirstOrDefault();
        }

        public async Task<Result<Guid>> DeleteDirect(Guid id, Guid userId)
        {
            return Result.Success(id);
        }

        public async Task<Result<object>> SendMessage(Guid ownerId, Guid userId, string text)
        {
            var direct = await GetByAccountIdsAsync(userId, ownerId, 0, 1);

            if (direct != null && direct.IsAccepted == false)
                return Result.Failure<Direct>("Invite is not accepted");

            if (direct == null)
            {
                var directCreationResult = await CreateNewDirect(userId, ownerId);

                if (directCreationResult.IsFailure)
                    return Result.Failure<Direct>(directCreationResult.Error);

                direct = directCreationResult.Value;
            }

            return await _context.Database.CreateExecutionStrategy().ExecuteAsync(async Task<Result<Direct>> () =>
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    var message = Message.Create(text, ownerId);

                    if (message.IsFailure)
                        return Result.Failure<Direct>(message.Error);

                    direct.Messages.Append(message.Value);
                    await _context.SaveChangesAsync();

                    transaction.Commit();

                    return direct;
                }
            });
        }
    }
}