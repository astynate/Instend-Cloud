using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Repositories.Contexts;
using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Repositories
{
    public class AccountsRepository : IAccountsRepository
    {
        private readonly GlobalContext _context = null!;

        private readonly IEncryptionService _encryptionService;

        private readonly IImageService _imageService;

        public AccountsRepository
        (
            GlobalContext context, 
            IEncryptionService encryptionService, 
            IImageService imageService
        )
        {
            _context = context;
            _encryptionService = encryptionService;
            _imageService = imageService;
        }

        public async Task<Core.Models.Account.Account?> GetByIdAsync(Guid id)
            => await GetAccountByExpression(user => user.Id == id);

        public async Task<Core.Models.Account.Account?> GetByEmailAsync(string email)
            => await GetAccountByExpression(user => user.Email == email);

        public async Task<Core.Models.Account.Account?> GetByEmailOrNicknameAsync(string username)
            => await GetAccountByExpression(user => user.Email == username || user.Nickname == username);

        public async Task<Core.Models.Account.Account?> GetByNicknameAsync(string nickname)
            => await GetAccountByExpression(user => user.Nickname == nickname);

        public async Task AddAsync(Core.Models.Account.Account account)
        {
            account.HashPassword(_encryptionService);

            await _context.Accounts.AddAsync(account);
            await _context.SaveChangesAsync();
        }

        public async Task<Result<double>> ChangeOccupiedSpaceValue(Guid accountId, double value)
        {
            var account = await GetByIdAsync(accountId);

            if (account == null)
                return Result.Failure<double>("Account not found");

            var result = account.UpdateOccupiedSpaceValue(value);

            if (result.IsFailure)
                return result;

            _context.Update(account);
            await _context.SaveChangesAsync();

            return result;
        }

        public async Task<Result> RecoverPassword(Guid userId, string password)
        {
            if (userId == Guid.Empty || string.IsNullOrEmpty(password))
                return Result.Failure("Invalid data");

            Core.Models.Account.Account? account = await GetByIdAsync(userId);

            if (account == null)
                return Result.Failure("User not found");

            var userRecoverPasswordResult = account.RecoverPassword(_encryptionService, password);

            if (userRecoverPasswordResult.IsFailure)
                return Result.Failure(userRecoverPasswordResult.Error);

            await _context.Accounts.Where(u => u.Id == userId).ExecuteUpdateAsync(u => u
                .SetProperty(property => property.Password, account.Password));

            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task Update(Guid userId, string name, string surname, string nickname)
        {
            await _context.Accounts.AsNoTracking()
                .Where(u => u.Id == userId)
                    .ExecuteUpdateAsync(user => user
                        .SetProperty(p => p.Name, name)
                        .SetProperty(p => p.Surname, surname)
                        .SetProperty(p => p.Nickname, nickname));

            await _context.SaveChangesAsync();
        }

        public Task<Core.Models.Account.Account[]> GetByPrefixAsync(string prefix)
        {
            throw new NotImplementedException();
        }

        public Task<Core.Models.Account.Account[]> GetPopuplarPeopleAsync(int from, int count)
        {
            throw new NotImplementedException();
        }

        public async Task Confirm(string email)
        {
            await _context.Accounts
                .Where(x => x.Email == email)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(p => p.IsConfirmed, true));
        }

        private async Task<Core.Models.Account.Account?> GetAccountByExpression(System.Linq.Expressions.Expression<Func<Core.Models.Account.Account, bool>> expression)
        {
            var account = await _context.Accounts
                .AsNoTracking()
                .FirstOrDefaultAsync(expression);

            if (account == null)
                return null;

            var avatar = Configuration.DefaultAvatar;
            var header = "";
            
            if (string.IsNullOrEmpty(account.Avatar) == false)
                avatar = Convert.ToBase64String(_imageService.CompressImage(await File.ReadAllBytesAsync(account.Avatar), 5, "png"));

            if (string.IsNullOrEmpty(account.Header) == false)
                header = Convert.ToBase64String(_imageService.CompressImage(await File.ReadAllBytesAsync(account.Header), 5, "png"));

            account.Avatar = avatar;
            account.Header = header;

            return account;
        }
    }
}