using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Comments;
using Instend.Core.Models.Storage;
using Instend.Core.Models.Abstraction;

namespace Instend.Repositories.Comments
{
    public interface IPublicationRepository<PublicationLink, AttachmentLink>
        where PublicationLink : LinkBase, ILinkBase, new()
        where AttachmentLink : LinkBase, ILinkBase, new()
    {
        //Task<Result<AttachmentModel>> GetAttachmentAsync(Guid itemId, Guid attachmentId);
    }
}