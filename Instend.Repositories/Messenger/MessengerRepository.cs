using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;

namespace Instend.Repositories.Messenger
{
    public class MessengerRepository : IMessengerRepository
    {
        private readonly MessagesContext _messageContext = null!;

        private readonly AccountsContext _context = null!;

        public MessengerRepository(AccountsContext context)
        {
            _context = context;
        }

        public async Task<bool> DeleteMessage(Guid id, Guid accountId)
        {
            return await _messageContext.Messages
                .AsNoTracking()
                .Where(x => x.Id == id && x.AccountId == accountId)
                .ExecuteDeleteAsync() > 0;
        }

        public async Task<bool> ViewMessage(Guid messageId, Guid userId)
        {
            var result = await _messageContext.Messages
                .Where(x => x.Id == messageId && x.AccountId != userId)
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.IsViewed, true));

            return result != 0;
        }
    }
}