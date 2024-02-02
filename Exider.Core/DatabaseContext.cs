using Exider.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Exider.Core
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
