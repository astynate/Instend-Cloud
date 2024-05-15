
using CSharpFunctionalExtensions;
using Exider.Core.Models.Comments;

namespace Exider.Core.Dependencies.Repositories.Comments
{
    public interface ICommentLinkBase
    {
        public abstract static Result<CommentLinkBase> Create<T>(Guid commentId, Guid albumId) where T : CommentLinkBase, new();
    }
}