using CSharpFunctionalExtensions;
using Exider.Core.Models.Comments;

namespace Exider.Repositories.Comments
{
    public interface ICommentsRepository
    {
        Task<Result<CommentModel>> AddComment(ICommentLinkRepository commentLink, string text, Guid ownerId, Guid itemId);
    }
}