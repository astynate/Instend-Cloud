using Exider.Core.Models.Account;

namespace Exider.Repositories.Account
{
    public interface IUserDataRepository
    {
        Task AddAsync(UserDataModel userData);
    }
}