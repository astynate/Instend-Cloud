
namespace Instend.Repositories.Account
{
    public interface IAccountsStatisticsRepository
    {
        Task<int> GetNumberOfRegisteretUsers(DateTime? start, DateTime? end);
    }
}