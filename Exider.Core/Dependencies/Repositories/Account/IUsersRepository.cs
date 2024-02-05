using Exider.Core.Models.Account;

namespace Exider.Core.Dependencies.Repositories.Account
{
    public interface IUsersRepository
    {
        Task<UserModel> GetUserAsync(string email);
        Task AddAsync(UserModel user);
    }
}