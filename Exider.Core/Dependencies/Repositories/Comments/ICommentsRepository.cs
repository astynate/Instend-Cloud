using CSharpFunctionalExtensions;
using Exider.Core.Dependencies.Repositories.Comments;
using Exider.Core.Models.Comments;
using Exider.Core.Models.Links;
using Microsoft.AspNetCore.Http;

namespace Exider.Repositories.Comments
{
    public interface ICommentsRepository<CommentLink, AttachmentLink>
        where CommentLink : LinkBase, ILinkBase, new()
        where AttachmentLink : LinkBase, ILinkBase, new()
    {
        Task<Result<CommentModel>> AddComment(string text, IFormFile[] files, Guid ownerId, Guid itemId);
        Task<object[]> GetAsync(Guid itemId);
    }
}