using CSharpFunctionalExtensions;

namespace Exider.Repositories.Comments
{
    public interface ICommentBaseRepository
    {
        Task<Result> DeleteAsync(Guid id);
    }
}