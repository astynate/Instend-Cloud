using Instend.Core.Models.Access;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Contexts
{
    public class AccessContext : DatabaseContextBase
    {
        public DbSet<FolderAccess> FolderAccesses { get; set; } = null!;
        public DbSet<AlbumAccess> AlbumAccess { get; set; } = null!;
        public DbSet<Core.Models.Access.FileAccess> FileAccess { get; set; } = null!;
    }
}