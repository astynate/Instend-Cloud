using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Comments;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Comments
{
    public class AlbumCommentsLinkRepository : ICommentLinkRepository
    {
        private readonly DatabaseContext _context;

        public AlbumCommentsLinkRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<object[]> GetAsync(Guid albumId)
        {
            var result = await _context.AlbumCommentLinks
                .Where(x => x.AlbumId == albumId)
                .Join(
                    _context.Comments,
                    albumCommentLink => albumCommentLink.CommentId,
                    comment => comment.Id,
                    (albumCommentLink, comment) => new
                    {
                        albumCommentLink,
                        comment
                    })
                .Join(
                    _context.Users,
                    prev => prev.comment.OwnerId,
                    user => user.Id,
                    (comment, user) => new
                    {
                        Comment = comment,
                        User = user
                    }).ToArrayAsync();

            return result;
        }

        public async Task<Result<Guid>> AddAsync(Guid itemId, Guid commentId)
        {
            var result = AlbumCommentLink.Create(commentId, itemId);

            if (result.IsFailure)
            {
                return Result.Failure<Guid>("An error occurred while trying to add a comment.");
            }

            await _context.AddAsync(result.Value);
            await _context.SaveChangesAsync();

            return result.Value.Id;
        }
    }
}