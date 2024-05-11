using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Dependencies.Repositories.Comments;
using Exider.Core.Models.Comments;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Comments
{
    public class CommentsRepository<T> : ICommentsRepository<T> where T : CommentLinkBase, ICommentLinkBase
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
            var result = await _entities
                .Where(x => x.AlbumId == itemId)
                .Join(
                    _context.Comments,
                    albumCommentLink => albumCommentLink.ItemId,
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

        public async Task<Result<CommentModel>> AddComment(string text, Guid ownerId, Guid albumId)
        {
            try
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

                        var creationResult = T.Create(result.Value.Id, albumId);

                        if (creationResult.IsFailure)
                        {
                            return Result.Failure<CommentModel>("Attempt to add a comment failed");
                        }

                        Console.WriteLine(creationResult.Value is CommentLinkBase);

                        T? link = creationResult.Value as T;

                        if (link is not null)
                        {
                            await _entities.AddAsync(link);
                            await _context.AddAsync(result.Value);
                            await _context.SaveChangesAsync();
                        }

                        await transaction.CommitAsync();

                        return result.Value;
                    }
                });
            }
            catch { }

            return Result.Failure<CommentModel>("Unknow error");
        }
    }
}
