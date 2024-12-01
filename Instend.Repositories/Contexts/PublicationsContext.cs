using Instend.Core.Models.Account;
using Instend.Core.Models.Public;
using Instend.Core.Models.Publication;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Contexts
{
    public class PublicationsContext : DatabaseContextBase
    {
        public DbSet<Publication> Publications { get; set; } = null!;
        public DbSet<AccountPublication> UserPublications { get; set; } = null!;
        public DbSet<PublicationAttachment> PublicationAttachments { get; set; } = null!;
        public DbSet<PublicationReaction> PublicationReactions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Entity<Publication>()
                .HasMany(p => p.Attechments)
                .WithMany(a => a.Publications)
                .UsingEntity<PublicationAttachment>();
        }
    }
}