using Instend.Core.Models.Access;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Contexts
{
    public class AccessContext : DatabaseContextBase
    {
        public DbSet<CollectionAccount> FolderAccesses { get; set; } = null!;
        public DbSet<AlbumsAccounts> AlbumAccess { get; set; } = null!;
        public DbSet<Core.Models.Access.FileAccount> FileAccess { get; set; } = null!;
    }
}