using Instend.Core.Models.Account;
using Instend.Core.Models.Email;
using Instend.Core.Models.Public;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Contexts
{
    public abstract class AccountsContext : DatabaseContextBase
    {
        public DbSet<Core.Models.Account.Account> Accounts { get; set; } = null!;
        public DbSet<AccountConfirmation> Confirmations { get; set; } = null!;
        public DbSet<AccountSession> Sessions { get; set; } = null!;
        public DbSet<AccountFollower> Followers { get; set; } = null!;
        public DbSet<AccountLink> Links { get; set; } = null!;
        public DbSet<Reaction> Reactions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<Core.Models.Account.Account>()
                .HasMany(x => x.Links)
                .WithOne()
                .HasForeignKey(x => x.AccountId);

            modelBuilder.Entity<Core.Models.Account.Account>()
                .HasMany(a => a.Followers)
                .WithOne()
                .HasForeignKey(af => af.AccountId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Core.Models.Account.Account>()
                .HasMany(a => a.Following)
                .WithOne()
                .HasForeignKey(af => af.FollowerId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}