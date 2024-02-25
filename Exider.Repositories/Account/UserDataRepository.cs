using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Account;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Account
{
    public class UserDataRepository : IUserDataRepository
    {

        private readonly DatabaseContext _context = null!;

        public UserDataRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task AddAsync(UserDataModel userData)
        {
            await _context.AddAsync(userData);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<object>> GetUserAsync(Guid id)
            => await _context.Users.Join(_context.UserData, user => user.Id, data => data.UserId,
                    (user, data) => new { User = user, UserData = data }).ToListAsync();

    }
}
