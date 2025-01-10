using CSharpFunctionalExtensions;
using Instend.Core.Models.Public;
using Instend.Repositories.Publications;

namespace Instend.Core.Dependencies.Repositories.Account
{
    public interface IPublicationsRepository
    {
        Task<List<Publication>> GetNewsByAccount(DateTime date, Guid[] targetAccounts, Guid accountId, int count);
        Task<Result<Publication>> AddAsync(PublicationTransferModel publicationTransferModel, Models.Account.Account account);
        Task<Result<Publication>> CommentAsync(string text, Guid publicationId, Models.Account.Account account);
        Task<Result<Publication>> UpdateAsync(UpdatePublicationTransferModel publicationTransferModel, Models.Account.Account account);
        Task<bool> DeleteAsync(Guid id, Guid ownerId);
        Task<Publication?> GetByIdAsync(Guid id);
        Task<Result<PublicationReaction?>> ReactAsync(Guid publicationId, Guid accountId, Guid reactionId);
        Task<List<Publication>> GetAccountPublications(Guid accountId, DateTime date, int count);
    }
}