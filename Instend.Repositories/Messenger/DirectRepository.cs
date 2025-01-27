using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Microsoft.EntityFrameworkCore;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Messenger.Direct;
using Instend.Core.Models.Messenger.Message;
using System.Linq.Expressions;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Account;

namespace Instend.Repositories.Messenger
{
    public class DirectRepository : IDirectRepository
    {
        private readonly GlobalContext _context = null!;

        private readonly IMessengerRepository _messengerRepository;

        private readonly IAccountsRepository _accountsRepository;

        private static readonly Func<Direct, Guid, bool> IsUserInvitor = (Direct direct, Guid userId) => direct.OwnerId == userId;

        private static readonly Func<Direct, Guid, bool> IsUserInvited = (Direct direct, Guid userId) => direct.AccountId == userId;

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

        public async Task<Result<Direct>> CreateNewDirect(Guid accountId, Guid ownerId)
        {
            var direct = Direct.Create(accountId, ownerId);

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
            => await GetAsync((d) => d.AccountId == userId || d.OwnerId == userId, 0, 1);

        public async Task<Direct?> GetAsync(Guid id, int numberOfSkipedMessages, int countMessages)
        {
            var result = await GetAsync
            (
                (d) => d.Id == id, 
                numberOfSkipedMessages, 
                countMessages
            );

            return result.FirstOrDefault();
        }

        public async Task<Direct?> GetByAccountIdsAsync(Guid userId, Guid ownerId, int numberOfSkipedMessages, int countMessages)
        {
            var result = await GetAsync
            (
                (x) => (x.OwnerId == userId && x.AccountId == ownerId) || (x.OwnerId == ownerId && x.AccountId == userId),
                numberOfSkipedMessages,
                countMessages
            );

            return result.FirstOrDefault();
        }

        public async Task<Result<Guid>> DeleteDirect(Guid interlocutorId, Guid accountId)
        {
            var direct = await _context.Directs
                .Where(x => (x.OwnerId == interlocutorId && x.AccountId == accountId) || (x.OwnerId == accountId && x.AccountId == interlocutorId))
                .Include(x => x.Messages)
                    .ThenInclude(x => x.Attachments)
                .FirstOrDefaultAsync();
            
            if (direct == null)
            {
                return Result.Failure<Guid>("Direct not found");
            }

            _context.Remove(direct);
            await _context.SaveChangesAsync();

            return direct.Id;
        }

        public async Task<Result<DatabaseModel>> SendMessage(Guid id, Guid senderId, string text)
        {
            var direct = await GetByAccountIdsAsync(senderId, id, 0, 1);

            if (direct == null)
            {
                var result = await CreateNewDirect(id, senderId);

                if (result.IsFailure)
                    return Result.Failure<DatabaseModel>(result.Error);

                direct = result.Value;
            }

            if (direct != null && direct.IsAccepted == false)
                return Result.Failure<DatabaseModel>("Invite is not accepted");

            return await _context.Database.CreateExecutionStrategy().ExecuteAsync(async Task<Result<DatabaseModel>> () =>
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    var message = Message.Create(text, id);

                    if (message.IsFailure)
                        return Result.Failure<DatabaseModel>(message.Error);

                    direct.Messages.Append(message.Value);

                    await _context.SaveChangesAsync();

                    transaction.Commit();

                    return direct;
                }
            });
        }
    }
}