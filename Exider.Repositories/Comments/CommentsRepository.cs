using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Exider.Core;
using Exider.Core.Models.Comments;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Comments
{
    public class CommentsRepository : ICommentsRepository
    {
        private readonly DatabaseContext _context;

        public CommentsRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Result<CommentModel>> AddComment(ICommentLinkRepository commentLink, string text, Guid ownerId, Guid albumId)
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

                        await _context.AddAsync(result.Value);
                        await _context.SaveChangesAsync();

                        await commentLink.AddAsync(albumId, result.Value.Id);
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
