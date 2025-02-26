using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Storage.Album;
using Instend.Core.Models.Storage.Collection;
using Instend.Core.Models.Storage.File;
using Instend.Core.Models.Storage.Files;
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
        public DbSet<Album> Albums { get; set; } = null!;
        public DbSet<AlbumAccount> AlbumsAccounts { get; set; } = null!;
        public DbSet<AlbumFile> AlbumsFiles { get; set; } = null!;
        public DbSet<Core.Models.Storage.File.File> Files { get; set; } = null!;
        public DbSet<FileAccount> FilesAccounts { get; set; } = null!;
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

            /// Collections
            /// [CONFIGURATION]

            modelBuilder.Entity<Collection>()
                .HasOne(x => x.ParentCollection)
                .WithMany(x => x.Collections)
                .HasForeignKey(x => x.CollectionId)
                .OnDelete(DeleteBehavior.Cascade);

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

            /// Files
            /// [CONFIGURATION]

            modelBuilder.Entity<Core.Models.Storage.File.File>()
                .HasOne(x => x.ParentCollection)
                .WithMany(x => x.Files)
                .HasForeignKey(x => x.CollectionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FileAccount>()
                .HasOne(ca => ca.File)
                .WithMany(c => c.AccountsWithAccess)
                .HasForeignKey(ca => ca.FileId)
                .HasPrincipalKey(a => a.Id);

            modelBuilder.Entity<FileAccount>()
                .HasOne(ca => ca.Account)
                .WithMany(a => a.Files)
                .HasForeignKey(ca => ca.AccountId)
                .HasPrincipalKey(a => a.Id);

            /// Albums
            /// [CONFIGURATION]

            modelBuilder.Entity<Album>()
                .HasMany(x => x.Files)
                .WithMany()
                .UsingEntity<AlbumFile>();

            modelBuilder.Entity<Album>()
                .HasMany(ca => ca.AccountsWithAccess)
                .WithOne(x => x.Album)
                .HasForeignKey(x => x.AlbumId)
                .HasPrincipalKey(x => x.Id);

            modelBuilder.Entity<AlbumAccount>()
                .HasOne(ca => ca.Account)
                .WithMany()
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