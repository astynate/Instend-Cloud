using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Storage
{
    public class StorageStatisticsReposotory : IStorageStatisticsReposotory
    {
        private readonly GlobalContext _context;

        public StorageStatisticsReposotory(GlobalContext context)
        {
            _context = context;
        }

        public async Task<object> GetAsync()
        {
            var files = await _context.Files.ToArrayAsync();
            var filesSize = files.Aggregate(0.0, (prev, curerent) => prev + curerent.Size);

            return new { filesLength = files.Length, filesSize };
        }
    }
}