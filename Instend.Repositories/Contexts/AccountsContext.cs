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
        public DbSet<AccountFollower> Followers { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Entity<Core.Models.Account.Account>()
                .HasMany(x => x.Followers)
                .WithMany()
                .UsingEntity<AccountFollower>(
                    j => j
                        .HasOne<Core.Models.Account.Account>()
                        .WithMany()
                        .HasForeignKey(x => x.AccountId),
                    j => j
                        .HasOne<Core.Models.Account.Account>()
                        .WithMany()
                        .HasForeignKey(x => x.FollowerId));

            modelBuilder
                .Entity<Core.Models.Account.Account>()
                .HasMany(x => x.Following)
                .WithMany()
                .UsingEntity<AccountFollower>(
                    j => j
                        .HasOne<Core.Models.Account.Account>()
                        .WithMany()
                        .HasForeignKey(x => x.FollowerId),
                    j => j
                        .HasOne<Core.Models.Account.Account>()
                        .WithMany()
                        .HasForeignKey(x => x.AccountId));
        }
    }
}