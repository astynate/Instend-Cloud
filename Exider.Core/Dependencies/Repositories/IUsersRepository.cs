using Exider.Core.Models;

namespace Exider.Dependencies.Repositories
{
    public interface IUsersRepository
    {
        Task<UserModel> GetUserByEmail(string email);
        Task<UserModel> GetUserByPublicId(string id);
        Task AddAsync(UserModel user);
    }
}