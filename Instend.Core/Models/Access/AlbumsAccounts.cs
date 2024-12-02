using System.ComponentModel.DataAnnotations.Schema;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Storage.Album;

namespace Instend.Core.Models.Access
{
    [Table("albums_accounts")]
    public class AlbumsAccounts : AccessBase
    {
        public Guid AlbumId { get; init; }
        public List<Album> Albums { get; set; } = [];

        public AlbumsAccounts(Guid albumId, Guid accountId, Configuration.EntityRoles role) : base(accountId, role)
        {
            AlbumId = albumId;
        }
    }
}