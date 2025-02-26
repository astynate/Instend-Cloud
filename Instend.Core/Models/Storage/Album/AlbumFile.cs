using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Storage.Album
{
    [Table("albums_files")]
    public class AlbumFile : DatabaseModel
    {
        public Album Album { get; set; } = null!;
        [Column("album_id")] public Guid AlbumId { get; set; }

        public File.File File { get; set; } = null!;
        [Column("file_id")] public Guid FileId { get; set; }

        private AlbumFile() { }

        public AlbumFile(Guid albumId, Guid fileId)
        {
            AlbumId = albumId;
            FileId = fileId;
        }
    }
}