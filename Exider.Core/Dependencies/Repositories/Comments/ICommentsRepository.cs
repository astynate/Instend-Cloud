using CSharpFunctionalExtensions;
using Exider.Core.Models.Comments;

namespace Exider.Repositories.Comments
{
    public interface ICommentsRepository<T> where T : CommentLinkBase
    {
        Task<Result<CommentModel>> AddComment(string text, Guid ownerId, Guid itemId);
        Task<object[]> GetAsync(Guid itemId);
    }
}