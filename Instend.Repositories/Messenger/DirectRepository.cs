using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Microsoft.EntityFrameworkCore;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Messenger.Direct;
using Instend.Core.Models.Messenger.Message;
using System.Linq.Expressions;
using Instend.Core.Models.Abstraction;

namespace Instend.Repositories.Messenger
{
    public class DirectRepository : IDirectRepository
    {
        private readonly GlobalContext _context = null!;

        private readonly IAccountsRepository _accountsRepository;

        public DirectRepository
        (
            GlobalContext context,
            IAccountsRepository accountsRepository
        )
        {
            _context = context;
            _accountsRepository = accountsRepository;
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

        private async Task<List<Direct>> GetAsync(Expression<Func<Direct, bool>> function, DateTime date, int countMessages, int skipDirects, int countDirects)
        {
            var result = await _context.Directs
                .Where(function)
                .Skip(skipDirects)
                .Take(countDirects)
                .Include(x => x.Account)
                .Include(x => x.Owner)
                .AsSplitQuery()
                .Include(x => x.Messages
                    .Where(x => x.Date < date)
                    .OrderByDescending(x => x.Date)
                    .Take(countMessages))
                    .ThenInclude(x => x.Attachments)
                .AsSplitQuery()
                .Include(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                .ToListAsync();

            return result;
        }

        public async Task<List<Direct>> GetAccountDirectsAsync(Guid userId)
            => await GetAsync((d) => d.AccountId == userId || d.OwnerId == userId, DateTime.Now, 1, 0, int.MaxValue);

        public async Task<Direct?> GetAsync(Guid id, DateTime date, int countMessages)
        {
            var result = await GetAsync((d) => d.Id == id, date, countMessages, 0, 1);
            return result.FirstOrDefault();
        }

        public async Task<Direct?> GetByAccountIdsAsync(Guid userId, Guid ownerId, DateTime date, int countMessages)
        {
            var result = await GetAsync
            (
                (x) => (x.OwnerId == userId && x.AccountId == ownerId) || (x.OwnerId == ownerId && x.AccountId == userId),
                date,
                countMessages,
                0,
                1
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
                return Result.Failure<Guid>("Direct not found");

            var attachments = direct.Messages.SelectMany(x => x.Attachments);

            _context.RemoveRange(attachments);
            _context.RemoveRange(direct.Messages);
            _context.Remove(direct);

            await _context.SaveChangesAsync();

            return direct.Id;
        }

        public async Task<Result<DatabaseModel>> SendMessage(Guid id, Guid senderId, string text)
        {
            var direct = await GetAsync(id, DateTime.Now, 1);

            if (direct != null && direct.IsAccepted == false)
                return Result.Failure<DatabaseModel>("Invite is not accepted");

            return await _context.Database.CreateExecutionStrategy().ExecuteAsync(async Task<Result<DatabaseModel>> () =>
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    if (direct == null)
                    {
                        var result = await CreateNewDirect(id, senderId);

                        if (result.IsFailure)
                            return Result.Failure<DatabaseModel>(result.Error);

                        direct = result.Value;
                    }

                    _context.Attach(direct);

                    var message = Message.Create(text, senderId);

                    if (message.IsFailure)
                        return Result.Failure<DatabaseModel>(message.Error);

                    await _context.Messages.AddAsync(message.Value);
                    await _context.SaveChangesAsync();

                    direct.Messages.Add(message.Value);
                    await _context.SaveChangesAsync();

                    transaction.Commit();

                    return direct;
                }
            });
        }

        public async Task<List<Direct>> GetAccountDirectsAsync(Guid userId, int skip, int take)
        {
            return await GetAsync((x) => x.OwnerId == userId || x.AccountId == userId, DateTime.Now, 1, skip, take);
        }

        public async Task<bool> AcceptDirect(Guid directId, Guid accountId)
        {
            var result = await _context.Directs
                .Where(x => x.Id == directId && x.AccountId == accountId)
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.IsAccepted, true));

            return result > 0;
        }
    }
}