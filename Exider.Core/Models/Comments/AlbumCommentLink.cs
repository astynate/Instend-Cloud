using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Comments
{
    [Table("album_comment_links")]
    public class AlbumCommentLink
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("comment_id")] public Guid CommentId { get; private set; }
        [Column("album_id")] public Guid AlbumId { get; private set; }

        private AlbumCommentLink() { }

        public static Result<AlbumCommentLink> Create(Guid commentId, Guid albumId)
        {
            if (commentId == Guid.Empty)
            {
                return Result.Failure<AlbumCommentLink>("Invalid comment id");
            }

            if (albumId == Guid.Empty)
            {
                return Result.Failure<AlbumCommentLink>("Invalid album id");
            }

            return new AlbumCommentLink()
            {
                CommentId = commentId,
                AlbumId = albumId
            };
        }
    }
}
