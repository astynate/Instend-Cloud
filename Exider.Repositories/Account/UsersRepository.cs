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

        private readonly IValidationService _validationService;

        public UsersRepository(DatabaseContext context, IEncryptionService encryptionService, IValidationService validationService)
        {
            _context = context;
            _encryptionService = encryptionService;
            _validationService = validationService;
        }

        public async Task AddAsync(UserModel? user)
        {

            if (user is null)
                throw new ArgumentNullException("User cannot be null");

            if (_validationService.ValidateVarchar(user.Name, user.Surname, user.Nickname) == false)
                throw new ArgumentNullException("Something went wrong");

            if (_validationService.ValidateEmail(user.Email) == false)
                throw new ArgumentNullException("Email cannot be null");

            if (_validationService.ValidatePassword(user.Password, 8, 45) == false)
                throw new ArgumentNullException("Email cannot be null");

            user.Password = _encryptionService.HashUsingSHA256(user.Password);

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

        }

        public async Task<UserModel?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.AsNoTracking()
                .FirstOrDefaultAsync(user => user.Email == email);
        }

        public async Task<UserModel?> GetUserByNicknameAsync(string nickname)
        {
            return await _context.Users.AsNoTracking()
                .FirstOrDefaultAsync(user => user.Nickname == nickname);
        }

    }

}