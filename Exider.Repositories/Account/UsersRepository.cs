using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Dependencies.Repositories.Account;
using Exider.Core.Models.Account;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

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
            => await _context.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Email == email);

        public async Task<UserModel?> GetUserByEmailOrNicknameAsync(string username) 
            => await _context.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Email == username || user.Nickname == username);

        public async Task<UserModel?> GetUserByIdAsync(Guid id) 
            => await _context.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Id == id);

        public async Task<UserModel?> GetUserByNicknameAsync(string nickname) 
            => await _context.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Nickname == nickname);

        public async Task<Result> RecoverPassword(Guid userId, string password)
        {
            if (userId == Guid.Empty || string.IsNullOrEmpty(password))
            {
                return Result.Failure("Ivalid data");
            }

            UserModel? user = await GetUserByIdAsync(userId);

            if (user is null)
            {
                return Result.Failure("User not found");
            }

            var userRecoverPasswordResult = user.RecoverPassword(_encryptionService, password);

            if (userRecoverPasswordResult.IsFailure)
            {
                return Result.Failure(userRecoverPasswordResult.Error);
            }

            await _context.SaveChangesAsync();
            return Result.Success();
        }
    }

}