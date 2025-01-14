using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Storage.Collection;
using Instend.Core.Models.Storage.File;
using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Contexts
{
    public class GlobalContext : PublicationsContext
    {
        private readonly IFileService _fileService;

        public GlobalContext(IFileService fileService) : base()
        {
            _fileService = fileService;
        }

        public DbSet<Collection> Collections { get; set; } = null!;
        public DbSet<CollectionAccount> CollectionsAccounts { get; set; } = null!;
        public DbSet<Core.Models.Storage.File.File> Files { get; set; } = null!;
        public DbSet<Attachment> Attachments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Entity<AccessBase>()
                .UseTpcMappingStrategy();

            modelBuilder
                .Entity<AccessItemBase>()
                .UseTpcMappingStrategy();

            modelBuilder.Entity<Collection>()
                .HasOne(x => x.ParentCollection)
                .WithMany(x => x.Collections)
                .HasForeignKey(x => x.CollectionId);

            modelBuilder.Entity<CollectionAccount>()
                .HasOne(ca => ca.Collection)
                .WithMany(c => c.AccountsWithAccess)
                .HasForeignKey(ca => ca.CollectionId)
                .HasPrincipalKey(a => a.Id);

            modelBuilder.Entity<CollectionAccount>()
                .HasOne(ca => ca.Account)
                .WithMany(a => a.Collections)
                .HasForeignKey(ca => ca.AccountId)
                .HasPrincipalKey(a => a.Id);
        }

        private void HandlerDatabaseStorageRelation(object[] entities)
        {
            foreach (var entity in entities)
            {
                if (entity is IDatabaseStorageRelation)
                {
                    var track = entity as IDatabaseStorageRelation;

                    if (track != null)
                    {
                        track.OnDelete(_fileService);
                    }
                }
            }
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ChangeTracker.DetectChanges();

            var deletedEntities = ChangeTracker.Entries()
                .Where(t => t.State == EntityState.Deleted)
                .Select(t => t.Entity)
                .ToArray();

            HandlerDatabaseStorageRelation(deletedEntities);

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}