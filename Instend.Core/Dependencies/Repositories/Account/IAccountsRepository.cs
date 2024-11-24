using CSharpFunctionalExtensions;
using Instend.Core.Models.Account;

namespace Instend.Core.Dependencies.Repositories.Account
{
    public interface IAccountsRepository
    {
        Task<AccountModel?> GetByIdAsync(Guid id);
        Task<AccountModel?> GetByEmailAsync(string email);
        Task<AccountModel?> GetByEmailOrNicknameAsync(string username);
        Task<AccountModel?> GetByNicknameAsync(string nickname);
        Task<AccountModel[]> GetByPrefixAsync(string prefix);
        Task<AccountModel[]> GetPopuplarPeopleAsync(int from, int count);
        Task Confirm(string email);
        Task AddAsync(AccountModel user);
        Task Update(Guid userId, string name, string surname, string nickname);
        Task<Result> RecoverPassword(Guid user, string password);
        Task<Result<double>> ChangeOccupiedSpaceValue(Guid userId, double value);
    }
}