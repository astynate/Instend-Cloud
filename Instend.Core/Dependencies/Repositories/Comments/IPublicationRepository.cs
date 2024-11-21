using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Comments;
using Instend.Core.Models.Storage;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Public;
using Microsoft.AspNetCore.Http;

namespace Instend.Repositories.Comments
{
    public interface IPublicationRepository<PublicationLink, AttachmentLink>
        where PublicationLink : LinkBase, ILinkBase, new()
        where AttachmentLink : LinkBase, ILinkBase, new()
    {
        Task<Result<PublicationModel>> AddComment(string text, IFormFile[] files, Guid ownerId, Guid itemId);
        Task<object[]> GetLastCommentsAsync(Guid[] id, DateTime date, int count, Guid userId);
        Task<Result<AttachmentModel>> GetAttachmentAsync(Guid itemId, Guid attachmentId);
    }
}