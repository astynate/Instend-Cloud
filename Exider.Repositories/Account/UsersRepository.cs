using Exider.Core;
using Exider.Core.Dependencies.Repositories.Account;
using Exider.Core.Models.Account;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Repositories
{
    public class UsersRepository : IUsersRepository
    {

        private readonly DatabaseContext _context = null!;

        private readonly IEncryptionService _encryptionService;

        public UsersRepository(DatabaseContext context, IEncryptionService encryptionService)
        {
            _context = context;
            _encryptionService = encryptionService;
        }

        public async Task AddAsync(UserModel user)
        {

            if (user is null)
            {
                throw new ArgumentNullException("User cannot be null");
            }

            user.HashPassword(_encryptionService);

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

        }

        public async Task<UserModel?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.AsNoTracking()
                .FirstOrDefaultAsync(user => user.Email == email);
        }

        public async Task<UserModel?> GetUserByEmailOrNicknameAsync(string username)
        {
            return await _context.Users.AsNoTracking()
                .FirstOrDefaultAsync(user => user.Email == username || user.Nickname == username);
        }

        public async Task<UserModel?> GetUserByNicknameAsync(string nickname)
        {
            return await _context.Users.AsNoTracking()
                .FirstOrDefaultAsync(user => user.Nickname == nickname);
        }

    }

}