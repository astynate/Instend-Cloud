using Instend.Core.Models.Formats;
using Instend.Core.Models.Storage.Album;
using Instend.Core.Models.Storage.Collection;
using Instend.Core.Models.Storage.File;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Contexts
{
    public class StorageContext : DatabaseContextBase
    {
        public DbSet<Album> Albums { get; set; } = null!;
        public DbSet<AlbumFile> AlbumFiles { get; set; } = null!;
        public DbSet<Collection> Folders { get; set; } = null!;
        public DbSet<Core.Models.Storage.File.File> Files { get; set; } = null!;
        public DbSet<Attachment> Attachments { get; set; } = null!;
        public DbSet<SongFormat> SongsMeta { get; set; } = null!;
    }
}