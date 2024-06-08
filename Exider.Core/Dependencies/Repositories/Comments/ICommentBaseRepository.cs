using CSharpFunctionalExtensions;

namespace Exider.Repositories.Comments
{
    public interface ICommentBaseRepository<AttachmentLink> where AttachmentLink : class
    {
        Task<Result> DeleteAsync(Guid id);
    }
}