using Exider.Core.Models.Account;

namespace Exider.Core.Dependencies.Repositories.Account
{
    public interface IUsersRepository
    {
        Task<UserModel?> GetUserByEmailAsync(string email);
        Task<UserModel?> GetUserByNicknameAsync(string nickname);
        Task AddAsync(UserModel user);
    }
}