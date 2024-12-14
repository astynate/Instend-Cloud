using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;

namespace Instend.Repositories.Messenger
{
    public class MessengerRepository : IMessengerRepository
    {
        private readonly GlobalContext _context = null!;

        public MessengerRepository(GlobalContext context)
        {
            _context = context;
        }

        public async Task<bool> DeleteMessage(Guid id, Guid accountId)
        {
            return await _context.Messages
                .AsNoTracking()
                .Where(x => x.Id == id && x.AccountId == accountId)
                .ExecuteDeleteAsync() > 0;
        }

        public async Task<bool> ViewMessage(Guid messageId, Guid userId)
        {
            var result = await _context.Messages
                .Where(x => x.Id == messageId && x.AccountId != userId)
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.IsViewed, true));

            return result != 0;
        }
    }
}