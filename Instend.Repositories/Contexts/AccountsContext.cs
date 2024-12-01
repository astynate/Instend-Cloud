using Instend.Core.Models.Account;
using Instend.Core.Models.Email;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Contexts
{
    public class AccountsContext : DatabaseContextBase
    {
        public DbSet<Core.Models.Account.Account> Accounts { get; set; } = null!;
        public DbSet<AccountConfirmation> Confirmations { get; set; } = null!;
        public DbSet<AccountSession> Sessions { get; set; } = null!;
        public DbSet<AccountFollower> Friends { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}