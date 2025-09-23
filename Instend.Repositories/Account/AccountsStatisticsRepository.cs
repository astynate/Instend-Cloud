using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Account
{
    public class AccountsStatisticsRepository : IAccountsStatisticsRepository
    {
        private readonly GlobalContext _context;

        public AccountsStatisticsRepository(GlobalContext context)
        {
            _context = context;
        }

        public async Task<int> GetNumberOfRegisteretUsers(DateTime? start, DateTime? end)
        {
            var accounts = Array.Empty<Core.Models.Account.Account>();

            if (start == null && end == null)
            {
                accounts = await _context.Accounts.ToArrayAsync();
            }
            else
            {
                accounts = await _context.Accounts
                    .Where(x => x.RegistrationDate > start && x.RegistrationDate < end)
                    .ToArrayAsync();
            }

            return accounts.Length;
        }
    }
}