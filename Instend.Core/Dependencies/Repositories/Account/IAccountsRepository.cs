using CSharpFunctionalExtensions;
using Instend.Core.Models.Account;
using Instend_Version_2._0._0.Server.TransferModels.Account;

namespace Instend.Core.Dependencies.Repositories.Account
{
    public interface IAccountsRepository
    {
        Task<Models.Account.Account?> GetByIdAsync(Guid id);
        Task<Models.Account.Account?> GetByEmailAsync(string email);
        Task<Models.Account.Account?> GetByEmailOrNicknameAsync(string username);
        Task<Models.Account.Account?> GetByNicknameAsync(string nickname);
        Task<Models.Account.Account[]> GetByPrefixAsync(string prefix);
        Task<Models.Account.Account[]> GetPopuplarPeopleAsync(int from, int count);
        Task Confirm(string email);
        Task AddAsync(Models.Account.Account user);
        Task Update(Guid userId, Core.Models.Account.Account account, UpdateAccountTranferModel updateAccountTranferModel);
        Task<Result> RecoverPassword(Guid user, string password);
        Task<Result<double>> ChangeOccupiedSpaceValue(Guid userId, double value);
        Task UpdateLinks(Models.Account.Account account, AccountLink[] links);
    }
}