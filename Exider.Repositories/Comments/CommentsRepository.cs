using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Dependencies.Repositories.Comments;
using Exider.Core.Models.Comments;
using Exider.Core.Models.Links;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Comments
{
    public class CommentsRepository<T> : ICommentsRepository<T> where T : LinkBase, ILinkBase, new()
    {
        private readonly DatabaseContext _context;

        private readonly DbSet<T> _entities;

        private readonly IFileService _fileService;

        public CommentsRepository(DatabaseContext context, IFileService fileService)
        {
            _context = context;
            _entities = context.Set<T>();
            _fileService = fileService;
        }

        public async Task<object[]> GetAsync(Guid itemId)
        {
            var comments = await _entities
                .Where(x => x.ItemId == itemId)
                .Join(
                    _context.Comments,
                    albumCommentLink => albumCommentLink.LinkedItemId,
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
                        prev.comment,
                        user
                    })
                .Join(
                    _context.UserData,
                    prev => prev.user.Id,
                    data => data.UserId,
                    (prev, data) => new
                    {
                        Comment = prev.comment,
                        User = new
                        {
                            prev.user.Id,
                            prev.user.Name,
                            prev.user.Surname,
                            prev.user.Nickname,
                            prev.user.Email,
                            AvatarPath = string.IsNullOrEmpty(data.Avatar) == false ?
                            data.Avatar : Configuration.DefaultAvatarPath
                        }
                    })
                .ToArrayAsync();

            var result = new List<object>();

            foreach (var comment in comments)
            {
                var avatar = await _fileService.ReadFileAsync(comment.User.AvatarPath);

                if (avatar.IsSuccess)
                {
                    result.Add(new
                    {
                        comment.Comment,
                        User = new
                        {
                            comment.User.Id,
                            comment.User.Name,
                            comment.User.Surname,
                            comment.User.Nickname,
                            comment.User.Email,
                            Avatar = avatar.Value
                        }
                    });
                }
            }

            return result.ToArray();
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

                    var creationResult = LinkBase.Create<T>(albumId, result.Value.Id);

                    if (creationResult.IsFailure)
                    {
                        return Result.Failure<CommentModel>("Attempt to add a comment failed");
                    }

                    T? link = creationResult.Value;

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
