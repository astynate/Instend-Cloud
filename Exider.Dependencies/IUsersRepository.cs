using Exider_Version_2._0._0.ServerApp.Models;

namespace Exider_Version_2._0._0.ServerApp.Dependencies
{
    public interface IUsersRepository
    {
        Task<UserModel> GetUserByEmail(string email);
        Task<UserModel> GetUserByPublicId(string id);
        Task AddAsync(UserModel user);
    }
}