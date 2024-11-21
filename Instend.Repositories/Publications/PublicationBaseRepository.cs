using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Links;
using Instend.Core.Models.Public;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Comments
{
    public class PublicationBaseRepository<AttachmentLink> : IPublicationBaseRepository<AttachmentLink> where AttachmentLink : LinkBase, new()
    {
        private readonly DatabaseContext _context;

        private readonly DbSet<AttachmentLink> _links;

        public PublicationBaseRepository(DatabaseContext context)
        {
            _context = context;
            _links = context.Set<AttachmentLink>();
        }

        public async Task<Result> DeleteAsync(Guid id)
        {
            PublicationModel[] comments = await _context.Publications
                .Where(c => c.Id == id).ToArrayAsync();

            if (comments.Length == 0)
                return Result.Failure("Comment not found");

            foreach (var comment in comments)
            {
                comment.SetAttachment(await _links
                    .Where(x => x.ItemId == comment.Id)
                    .Join(_context.Attachments,
                        link => link.LinkedItemId,
                        attachment => attachment.Id,
                        (link, attachments) => attachments)
                    .ToArrayAsync());

                foreach (var attachment in comment.attechments)
                {
                    if (File.Exists(attachment.Path))
                    {
                        File.Delete(attachment.Path);
                    }

                    _context.Remove(attachment);
                }

                _context.Remove(comment);
            }

            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<bool> IsUserLikedPubliction(Guid userId, Guid publictionId)
        {
            PublictionLikeLink? publictionLikeLink = await _context.PublicationLikeLinks
                .FirstOrDefaultAsync(x => x.ItemId == publictionId && x.LinkedItemId == userId);

            return publictionLikeLink != null;
        }

        public async Task<Result<bool>> SetLike(Guid id, Guid userId)
        {
            PublicationModel? comment = await _context.Publications.FirstOrDefaultAsync(x => x.Id == id);

            PublictionLikeLink? publictionLikeLink = await _context.PublicationLikeLinks
                .FirstOrDefaultAsync(x => x.ItemId == id && x.LinkedItemId == userId);

            if (comment == null)
            {
                return Result.Failure<bool>("Publiction not found");
            }

            if (publictionLikeLink == null)
            {
                Result<PublictionLikeLink> link = LinkBase.Create<PublictionLikeLink>(id, userId);

                if (link.IsFailure)
                {
                    return Result.Failure<bool>("Publiction not found");
                }

                comment.IncrementLikes();

                await _context.PublicationLikeLinks.AddAsync(link.Value);
                await _context.SaveChangesAsync();

                return true;
            }
            else
            {
                comment.DecrementLikes();

                await _context.PublicationLikeLinks.Where(x => x.ItemId == id && x.LinkedItemId == userId).ExecuteDeleteAsync();
                await _context.SaveChangesAsync();

                return false;
            }
        }
    }
}