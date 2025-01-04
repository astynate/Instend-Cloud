using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Core.Models.Account;
using Instend.Repositories.Contexts;
using Instend_Version_2._0._0.Server.TransferModels.Account;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Repositories
{
    public class AccountsRepository : IAccountsRepository
    {
        private readonly GlobalContext _context = null!;

        private readonly IEncryptionService _encryptionService;

        public AccountsRepository
        (
            GlobalContext context, 
            IEncryptionService encryptionService
        )
        {
            _context = context;
            _encryptionService = encryptionService;
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

            var account = await GetByIdAsync(userId);

            if (account == null)
                return Result.Failure("User not found");

            var userRecoverPasswordResult = account
                .RecoverPassword(_encryptionService, password);

            if (userRecoverPasswordResult.IsFailure)
                return Result.Failure(userRecoverPasswordResult.Error);

            await _context.Accounts
                .Where(u => u.Id == userId)
                .ExecuteUpdateAsync(u => u
                    .SetProperty(property => property.Password, account.Password));

            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task UpdateLinks(Core.Models.Account.Account account, AccountLink[]? links)
        {
            if (links == null) 
            {
                _context.Links.RemoveRange(account.Links);

                await _context.SaveChangesAsync();

                return;
            }

            var linksToDelete = account.Links
                .Where(existingLink => !links.Select(x => x.Id).Contains(existingLink.Id));

            var linksToAdd = links
                .Where(newLink => !account.Links.Select(x => x.Id).Contains(newLink.Id));

            var linksToEditNew = links
                .Where(newLink => account.Links.Select(x => x.Id).Contains(newLink.Id))
                .OrderBy(x => x.Id)
                .ToArray();

            var linksToEditPrev = account.Links
                .Where(prev => links.Select(x => x.Id).Contains(prev.Id))
                .OrderBy(x => x.Id)
                .ToArray();

            _context.AttachRange(linksToEditPrev);

            if (linksToAdd.Count() + linksToEditNew.Length > 7)
            {
                return;
            }

            foreach (var link in links)
            {
                link.AccountId = account.Id;
            }

            for (int i = 0; i < linksToEditPrev.Length; i++)
            {
                linksToEditPrev[i].Link = linksToEditNew[i].Link;
                linksToEditPrev[i].LinkId = linksToEditNew[i].LinkId;
                linksToEditPrev[i].Name = linksToEditNew[i].Name;
            }

            if (linksToAdd.Any())
                await _context.Links.AddRangeAsync(linksToAdd);

            if (linksToDelete.Any())
                _context.Links.RemoveRange(linksToDelete);

            await _context.SaveChangesAsync();
        }

        public async Task Update(Guid userId, Core.Models.Account.Account account, UpdateAccountTranferModel accountTransferModel)
        {
            if (string.IsNullOrEmpty(accountTransferModel.name))
                return;

            if (string.IsNullOrEmpty(accountTransferModel.surname))
                return;

            if (string.IsNullOrEmpty(accountTransferModel.nickname))
                return;

            await UpdateLinks(account, accountTransferModel.links);

            await _context.Accounts.AsNoTracking()
                .Where(u => u.Id == userId)
                    .ExecuteUpdateAsync(user => user
                        .SetProperty(p => p.Name, accountTransferModel.name)
                        .SetProperty(p => p.Surname, accountTransferModel.surname)
                        .SetProperty(p => p.Description, accountTransferModel.description)
                        .SetProperty(p => p.Nickname, accountTransferModel.nickname));

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
                .Where(expression)
                .Include(x => x.Links)
                .FirstOrDefaultAsync();

            return account;
        }
    }
}