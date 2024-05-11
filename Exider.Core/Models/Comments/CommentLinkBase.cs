using CSharpFunctionalExtensions;
using Exider.Core.Dependencies.Repositories.Comments;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Comments
{
    public class CommentLinkBase : ICommentLinkBase
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("item_id")] public Guid ItemId { get; private set; }
        [Column("album_id")] public Guid AlbumId { get; private set; }

        protected CommentLinkBase() { }

        public static Result<CommentLinkBase> Create(Guid commentId, Guid albumId)
        {
            if (commentId == Guid.Empty)
            {
                return Result.Failure<CommentLinkBase>("Invalid comment id");
            }

            if (albumId == Guid.Empty)
            {
                return Result.Failure<CommentLinkBase>("Invalid album id");
            }

            return new CommentLinkBase()
            {
                ItemId = commentId,
                AlbumId = albumId
            };
        }
    }
}