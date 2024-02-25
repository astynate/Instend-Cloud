using Exider.Core.Models.Account;
using Exider.Core.Models.Email;
using Microsoft.EntityFrameworkCore;

namespace Exider.Core
{
    public class DatabaseContext : DbContext
    {

        public DbSet<UserModel> Users { get; set; } = null!;
        public DbSet<EmailModel> Email { get; set; } = null!;
        public DbSet<SessionModel> Sessions { get; set; } = null!;
        public DbSet<ConfirmationModel> Confirmation { get; set; } = null!;
        public DbSet<UserDataModel> UserData { get; set; } = null!;

        public DatabaseContext() => Database.EnsureCreated();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql("server=localhost;user=root;password=47188475;database=async_storage",
                new MySqlServerVersion(new Version(8, 3, 0)));
        }

    }

}
