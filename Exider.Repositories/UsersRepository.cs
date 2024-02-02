using Exider.Core;
using Exider.Core.Models;
using Exider.Dependencies.Repositories;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories
{
    public class UsersRepository : IUsersRepository
    {

        private readonly DatabaseContext _context = null!;

        public UsersRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<UserModel> GetUserByPublicId(string id)
        {

            uint privateId = EncryptionService
                .DecryptPublicIdToPrivate(id);

            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.PublicId == id)
                    ?? throw new ArgumentException("User id cannot be empty");

        }

        public async Task<UserModel> GetUserByEmail(string email)
        {

            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.Email == email)
                    ?? throw new ArgumentException("User email cannot be empty");

        }

        public async Task AddAsync(UserModel user)
        {

            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            user.Password = EncryptionService
                .HashUsingSHA256(user.Password);

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

        }

    }

}
