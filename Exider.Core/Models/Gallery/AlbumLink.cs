using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Exider.Core.Models.Gallery
{
    [Table("album_link")]
    public class AlbumLink
    {
        [Key][Column("id")] public Guid Id { get; private set; }
        [Column("album_id")] public Guid AlbumId { get; private set; }
        [Column("file_id")] public Guid FileId { get; private set; }

        private AlbumLink() { }

        public static Result<AlbumLink> Create(Guid albumId, Guid fileId)
        {
            if (albumId == Guid.Empty)
            {
                return Result.Failure<AlbumLink>("Invalid folder id");
            }

            if (fileId == Guid.Empty)
            {
                return Result.Failure<AlbumLink>("Invalid file id");
            }

            return Result.Success(new AlbumLink()
            {
                Id = Guid.NewGuid(),
                AlbumId = albumId,
                FileId = fileId
            });
        }
    }
}
