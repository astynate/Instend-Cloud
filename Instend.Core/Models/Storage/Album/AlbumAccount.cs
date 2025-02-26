using System.ComponentModel.DataAnnotations.Schema;
using Instend.Core.Models.Abstraction;

namespace Instend.Core.Models.Storage.Album
{
    [Table("albums_accounts")]
    public class AlbumAccount : AccessBase
    {
        public Album Album { get; set; } = null!;
        [Column("album_id")] public Guid AlbumId { get; set; }

        private AlbumAccount() { }

        public AlbumAccount(Album album, Guid accountId, Configuration.EntityRoles role) : base(role)
        {
            Album = album;
            AccountId = accountId;
        }
    }
}