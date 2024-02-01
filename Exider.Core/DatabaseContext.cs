using Exider_Version_2._0._0.ServerApp.Models;
using Microsoft.EntityFrameworkCore;

namespace Exider_Version_2._0._0.ServerApp.Configuration
{
    public class DatabaseContext : DbContext
    {

        public DbSet<UserModel> Users { get; set; } = null!;
        public DbSet<SessionModel> Sessions { get; set; } = null!;

        public DatabaseContext() => Database.EnsureCreated();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(Configuration.mySqlConnectionString,
                new MySqlServerVersion(new Version(8, 3, 0)));
        }

    }

}
