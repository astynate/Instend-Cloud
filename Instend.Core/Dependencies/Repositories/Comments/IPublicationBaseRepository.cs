using CSharpFunctionalExtensions;

namespace Instend.Repositories.Comments
{
    public interface IPublicationBaseRepository<AttachmentLink> where AttachmentLink : class
    {
        Task<Result> DeleteAsync(Guid id);
        Task<bool> IsUserLikedPubliction(Guid userId, Guid publictionId);
        Task<Result<bool>> SetLike(Guid id, Guid userId);
    }
}