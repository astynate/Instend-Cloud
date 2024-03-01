using CSharpFunctionalExtensions;
using Exider.Core.Models.Account;

namespace Exider.Core.Dependencies.Repositories.Account
{
    public interface IUsersRepository
    {
        Task<UserModel?> GetUserByEmailAsync(string email);
        Task<UserModel?> GetUserByIdAsync(Guid id);
        Task<Result> RecoverPassword(Guid user, string password);
        Task<UserModel?> GetUserByEmailOrNicknameAsync(string username);
        Task<UserModel?> GetUserByNicknameAsync(string nickname);
        Task Update(Guid userId, string name, string surname, string nickname);
        Task AddAsync(UserModel user);
    }
}