using Instend.Repositories.Account;
using Instend.Repositories.Storage;
using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers.Statistics
{
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly IAccountsStatisticsRepository _accountsStatisticsRepository;

        private readonly IStorageStatisticsReposotory _storageStatisticsRepository;

        public StatisticsController(IAccountsStatisticsRepository accountsStatisticsRepository, IStorageStatisticsReposotory storageStatisticsRepository)
        {
            _accountsStatisticsRepository = accountsStatisticsRepository;
            _storageStatisticsRepository = storageStatisticsRepository;
        }

        [HttpGet]
        [Route("/api/statistics/users")]
        public async Task<IActionResult> GetAccounts(DateTime? start, DateTime? finish)
        {
            return Ok(await _accountsStatisticsRepository.GetNumberOfRegisteretUsers(start, finish));
        }

        [HttpGet]
        [Route("/api/statistics/files")]
        public async Task<IActionResult> GetFiles()
        {
            return Ok(await _storageStatisticsRepository.GetAsync());
        }
    }
}