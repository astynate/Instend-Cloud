using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Contexts
{
    public abstract class DatabaseContextBase : DbContext
    {
        public DatabaseContextBase() => Database.EnsureCreated();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = "server=localhost;user=root;password=47188475;database=async_storage";
            var version = new MySqlServerVersion(new Version(8, 3, 0));

            optionsBuilder.EnableSensitiveDataLogging();
            optionsBuilder.UseMySql(connectionString, version, mySqlOptions => mySqlOptions.EnableRetryOnFailure());
        }
    }
}