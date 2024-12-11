using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Access;
using Instend.Core.Models.Formats;
using Instend.Core.Models.Storage.Album;
using Instend.Core.Models.Storage.Collection;
using Instend.Core.Models.Storage.File;
using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Contexts
{
    public class StorageContext : DatabaseContextBase
    {
        private readonly IFileService _fileService;

        public StorageContext(IFileService fileService) : base()
        {
            _fileService = fileService;
        }

        public DbSet<Album> Albums { get; set; } = null!;
        public DbSet<AlbumFile> AlbumsFiles { get; set; } = null!;
        public DbSet<AlbumAccount> AlbumsAccounts { get; set; } = null!;

        public DbSet<Collection> Collections { get; set; } = null!;
        public DbSet<CollectionAccount> CollectionsAccounts { get; set; } = null!;

        public DbSet<Core.Models.Storage.File.File> Files { get; set; } = null!;
        public DbSet<FileAccount> FilesAccounts { get; set; } = null!;

        public DbSet<Attachment> Attachments { get; set; } = null!;
        public DbSet<SongFormat> SongsMeta { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Entity<AccessBase>()
                .UseTpcMappingStrategy();

            modelBuilder
                .Entity<AccessItemBase>()
                .UseTpcMappingStrategy();


            modelBuilder
                 .Entity<CollectionAccount>()
                 .HasOne(ca => ca.Collection)
                 .WithMany(c => c.AccountsWithAccess as IEnumerable<CollectionAccount>);

            modelBuilder
                .Entity<CollectionAccount>()
                .HasOne(ca => ca.Account)
                .WithMany(a => a.Collections);


            modelBuilder
                .Entity<FileAccount>()
                 .HasOne(fa => fa.File)
                 .WithMany(f => f.AccountsWithAccess as IEnumerable<FileAccount>);

            modelBuilder
                .Entity<FileAccount>()
                .HasOne(fa => fa.Account)
                .WithMany(a => a.Files);


            modelBuilder
                .Entity<AlbumAccount>()
                .HasOne(fa => fa.Album)
                .WithMany(f => f.AccountsWithAccess as IEnumerable<AlbumAccount>);
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

        public override int SaveChanges()
        {
            ChangeTracker.DetectChanges();

            var deletedEntities = ChangeTracker.Entries()
                .Where(t => t.State == EntityState.Deleted)
                .Select(t => t.Entity)
                .ToArray();

            HandlerDatabaseStorageRelation(deletedEntities);

            return base.SaveChanges();
        }
    }
}