using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Dependencies.Repositories.Comments;
using Exider.Core.Models.Comments;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Comments
{
    public class CommentsRepository<T> : ICommentsRepository<T> where T : CommentLinkBase, ICommentLinkBase, new()
    {
        private readonly DatabaseContext _context;

        private readonly DbSet<T> _entities;

        public CommentsRepository(DatabaseContext context)
        {
            _context = context;
            _entities = context.Set<T>();
        }

        public async Task<object[]> GetAsync(Guid itemId)
        {
            return await _entities
                .Where(x => x.ItemId == itemId)
                .Join(
                    _context.Comments,
                    albumCommentLink => albumCommentLink.CommentId,
                    comment => comment.Id,
                    (albumCommentLink, comment) => new
                    {
                        comment
                    })
                .Join(
                    _context.Users,
                    prev => prev.comment.OwnerId,
                    user => user.Id,
                    (prev, user) => new
                    {
                        Comment = prev.comment,
                        User = new
                        {
                            user.Id,
                            user.Name,
                            user.Surname,
                            user.Nickname,
                            user.Email,
                        }
                    })
                .ToArrayAsync();
        }

        public async Task<Result<CommentModel>> AddComment(string text, Guid ownerId, Guid albumId)
        {
            return await _context.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    var result = CommentModel.Create(text, ownerId);

                    if (result.IsFailure)
                    {
                        return Result.Failure<CommentModel>("Attempt to add a comment failed");
                    }

                    var creationResult = T.Create<T>(result.Value.Id, albumId);

                    if (creationResult.IsFailure)
                    {
                        return Result.Failure<CommentModel>("Attempt to add a comment failed");
                    }

                    T? link = creationResult.Value as T;

                    if (link is not null)
                    {
                        await _context.AddAsync(result.Value);
                        await _context.SaveChangesAsync();

                        await _entities.AddAsync(link);
                        await _context.SaveChangesAsync();
                    }

                    await transaction.CommitAsync();

                    return result.Value;
                }
            });
        }
    }
}
