using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Dependencies.Repositories.Comments;
using Exider.Core.Dependencies.Repositories.Storage;
using Exider.Core.Models.Comments;
using Exider.Core.Models.Links;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Exider.Repositories.Comments
{
    public class CommentsRepository<CommentLink, AttachmentLink> : ICommentsRepository<CommentLink, AttachmentLink>
        where CommentLink : LinkBase, ILinkBase, new()
        where AttachmentLink : LinkBase, ILinkBase, new()
    {
        private readonly DatabaseContext _context;
        private readonly DbSet<CommentLink> _entities;
        private readonly IFileService _fileService;
        private readonly IAttachmentsRepository<AttachmentLink> _attachmentsRepository;

        public CommentsRepository
        (
            DatabaseContext context,
            IFileService fileService,
            IAttachmentsRepository<AttachmentLink> attachmentsRepository
        )
        {
            _context = context;
            _entities = context.Set<CommentLink>();
            _fileService = fileService;
            _attachmentsRepository = attachmentsRepository;
        }


        public async Task<object[]> GetAsync(Guid itemId)
        {
            var comments = await _entities
                .Where(x => x.ItemId == itemId)
                .Join(
                    _context.Comments,
                    albumCommentLink => albumCommentLink.LinkedItemId,
                    comment => comment.Id,
                    (albumCommentLink, comment) => new { comment }
                )
                .OrderByDescending(x => x.comment.Date)
                .Join(
                    _context.Users,
                    prev => prev.comment.OwnerId,
                    user => user.Id,
                    (prev, user) => new { prev.comment, user }
                )
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
                            AvatarPath = !string.IsNullOrEmpty(data.Avatar) ? data.Avatar : Configuration.DefaultAvatarPath
                        }
                    }
                )
                .GroupJoin(
                    _context.CommentAttachments,
                    prev => prev.Comment.Id,
                    link => link.ItemId,
                    (prev, link) => new { prev, link }
                )
                .SelectMany(
                    x => x.link.DefaultIfEmpty(),
                    (prev, link) => new
                    {
                        prev.prev.Comment,
                        prev.prev.User,
                        Attachment = link != null ? new { link.LinkedItemId, link.ItemId } : null
                    }
                )
                .GroupJoin(_context.Attachments,
                    prev => prev.Attachment.LinkedItemId,
                    attachment => attachment.Id,
                    (prev, attachment) => new
                    {
                        prev.Comment,
                        prev.User,
                        attachment
                    })
                .ToListAsync();

            var result = new List<object>();

            foreach (var comment in comments)
            {
                var avatar = await _fileService.ReadFileAsync(comment.User.AvatarPath);

                foreach (var attachment in comment.attachment)
                {
                    await attachment.SetFile(_fileService);
                }

                comment.Comment.SetAttachment(comment.attachment.ToArray());

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

        public async Task<Result<CommentModel>> AddComment(string text, IFormFile[] files, Guid ownerId, Guid albumId)
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

                    var creationResult = LinkBase.Create<CommentLink>(albumId, result.Value.Id);

                    if (creationResult.IsFailure)
                    {
                        return Result.Failure<CommentModel>("Attempt to add a comment failed");
                    }

                    CommentLink? link = creationResult.Value;

                    if (link is not null)
                    {
                        await _context.AddAsync(result.Value);
                        await _context.SaveChangesAsync();

                        await _entities.AddAsync(link);
                        await _context.SaveChangesAsync();
                    }

                    AttachmentModel[] attachments = new AttachmentModel[files.Length]; 

                    for (int i = 0; i < files.Length; i++)
                    {
                        if (files[i].Length > 0)
                        {
                            using (var memoryStream = new MemoryStream())
                            {
                                await files[i].CopyToAsync(memoryStream);
                                byte[] fileBytes = memoryStream.ToArray();

                                var attachment = await _attachmentsRepository.AddAsync
                                (
                                    memoryStream.ToArray(),
                                    files[i].Name,
                                    files[i].ContentType,
                                    files[i].Length,
                                    ownerId,
                                    result.Value.Id
                                );

                                if (attachment.IsFailure)
                                {
                                    transaction.Rollback();
                                    return Result.Failure<CommentModel>("");
                                }

                                attachments[i] = attachment.Value;
                                await attachments[i].SetFile(_fileService);
                            }
                        }
                    }

                    result.Value.SetAttachment(attachments);
                    await transaction.CommitAsync();

                    return result.Value;
                }
            });
        }
    }
}