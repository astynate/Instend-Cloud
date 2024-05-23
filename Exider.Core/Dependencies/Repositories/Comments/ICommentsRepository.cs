using CSharpFunctionalExtensions;
using Exider.Core.Models.Comments;
using Exider.Core.Models.Links;

namespace Exider.Repositories.Comments
{
    public interface ICommentsRepository<T> where T : LinkBase
    {
        Task<Result<CommentModel>> AddComment(string text, Guid ownerId, Guid itemId);
        Task<object[]> GetAsync(Guid itemId);
    }
}