using System.ComponentModel.DataAnnotations.Schema;
using Instend.Core.Models.Abstraction;

namespace Instend.Core.Models.Storage.Album
{
    [Table("albums_files")] 
    public class AlbumFile : DatabaseModel 
    {
        [Column("album_id")]
        public Guid AlbumId { get; private set; }

        [Column("file_id")]
        public Guid FileId { get; private set; }
    }
}