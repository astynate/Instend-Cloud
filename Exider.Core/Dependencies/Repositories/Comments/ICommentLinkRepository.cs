using CSharpFunctionalExtensions;

namespace Exider.Repositories.Comments
{
    public interface ICommentLinkRepository
    {
        Task<Result<Guid>> AddAsync(Guid itemId, Guid commentId);
        Task<object[]> GetAsync(Guid albumId);
    }
}
