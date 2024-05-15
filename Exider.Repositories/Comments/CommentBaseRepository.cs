using CSharpFunctionalExtensions;
using Exider.Core;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Comments
{
    public class CommentBaseRepository : ICommentBaseRepository
    {
        private readonly DatabaseContext _context;

        public CommentBaseRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Result> DeleteAsync(Guid id)
        {
            int result = await _context.Comments
                .Where(c => c.Id == id)
                .ExecuteDeleteAsync();

            if (result == 0)
            {
                return Result.Failure("Comment not found");
            }

            await _context.SaveChangesAsync();

            return Result.Success();
        }
    }
}