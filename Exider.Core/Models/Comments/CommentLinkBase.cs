using CSharpFunctionalExtensions;
using Exider.Core.Dependencies.Repositories.Comments;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Comments
{
    public class CommentLinkBase : ICommentLinkBase
    {
        [Column("id")][Key] public Guid Id { get; protected set; } = Guid.NewGuid();
        [Column("item_id")] public Guid ItemId { get; protected set; }
        [Column("comment_id")] public Guid CommentId { get; protected set; }

        protected CommentLinkBase() { }

        public static Result<CommentLinkBase> Create<T>(Guid commentId, Guid itemId) where T : CommentLinkBase, new()
        {
            if (commentId == Guid.Empty)
            {
                return Result.Failure<CommentLinkBase>("Invalid comment id");
            }

            if (itemId == Guid.Empty)
            {
                return Result.Failure<CommentLinkBase>("Invalid album id");
            }

            return new T()
            {
                ItemId = itemId,
                CommentId = commentId
            };
        }
    }
}