using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Exider.Core;
using Exider.Core.Dependencies.Repositories.Comments;
using Exider.Core.Dependencies.Repositories.Storage;
using Exider.Core.Models.Comments;
using Exider.Core.Models.Links;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace Exider.Repositories.Comments
{
    public class CommentsRepository<CommentLink, AttachmentLink> : ICommentsRepository<CommentLink, AttachmentLink>
        where CommentLink : LinkBase, new()
        where AttachmentLink : LinkBase, new()
    {
        private readonly DatabaseContext _context;

        private readonly DbSet<CommentLink> _entities;

        private readonly DbSet<AttachmentLink> _links;

        private readonly IFileService _fileService;

        private readonly IPreviewService _previewService;

        private readonly IAttachmentsRepository<AttachmentLink> _attachmentsRepository;

        public CommentsRepository
        (
            DatabaseContext context,
            IFileService fileService,
            IPreviewService previewService,
            IAttachmentsRepository<AttachmentLink> attachmentsRepository
        )
        {
            _context = context;
            _entities = context.Set<CommentLink>();
            _links = context.Set<AttachmentLink>();
            _fileService = fileService;
            _attachmentsRepository = attachmentsRepository;
            _previewService = previewService;
        }

        public async Task<object[]> GetLastCommentsAsync(Guid id, DateTime lastPublictionTime, int count)
        {
            if (typeof(CommentLink).Name == "ComminityPublicationLink")
            {
                return await GetCommunityPublictions(id, lastPublictionTime, count);
            }
            else
            {
                return await GetPersonalPublictions(id, lastPublictionTime, count);
            }
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

                                string[] name = files[i].FileName.Split(".");

                                string? fileName = name.Length >= 1 ? name[0] : null;
                                string? fileType = name.Length >= 2 ? name[name.Length - 1] : null;

                                if (Configuration.postAvailableTypes.Contains(fileType) == false || name == null)
                                {
                                    transaction.Rollback();
                                    return Result.Failure<CommentModel>("Invalid type");
                                }

                                var attachment = await _attachmentsRepository.AddAsync
                                (
                                    memoryStream.ToArray(),
                                    fileName,
                                    fileType,
                                    files[i].Length,
                                    ownerId,
                                    result.Value.Id
                                );

                                if (attachment.IsFailure)
                                {
                                    transaction.Rollback();
                                    return Result.Failure<CommentModel>(attachment.Error);
                                }

                                attachments[i] = attachment.Value;
                                await attachments[i].SetFile(_previewService);
                            }
                        }
                    }

                    result.Value.SetAttachment(attachments);
                    await transaction.CommitAsync();

                    return result.Value;
                }
            });
        }

        public async Task<Result<AttachmentModel>> GetAttachmentAsync(Guid itemId, Guid attachmentId)
        {
            AttachmentLink? model = await _links.FirstOrDefaultAsync(x => x.ItemId == itemId && x.LinkedItemId == attachmentId);

            if (model == null)
            {
                return Result.Failure<AttachmentModel>("Atachment not found");
            }

            AttachmentModel? attachment = await _attachmentsRepository.GetByIdAsync(model.LinkedItemId);

            if (attachment == null)
            {
                return Result.Failure<AttachmentModel>("Atachment not found");
            }

            return attachment;
        }

        private async Task<object[]> GetPersonalPublictions(Guid id, DateTime lastPublictionTime, int count)
        {
            var comments = await _entities
                .Where(x => x.ItemId == id)
                .Join(
                    _context.Comments,
                    albumCommentLink => albumCommentLink.LinkedItemId,
                    comment => comment.Id,
                    (albumCommentLink, comment) => new { comment }
                )
                .Where(x => x.comment.Date < lastPublictionTime)
                .OrderByDescending(x => x.comment.Date)
                .Take(count)
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
                .ToListAsync();

            foreach (var comment in comments)
            {
                comment.Comment.SetAttachment(await _links
                    .Where(x => x.ItemId == comment.Comment.Id)
                    .Join(_context.Attachments,
                        link => link.LinkedItemId,
                        attachment => attachment.Id,
                        (link, attachments) => attachments)
                    .ToArrayAsync());
            }

            var result = new List<object>();

            foreach (var comment in comments)
            {
                var avatar = await _fileService.ReadFileAsync(comment.User.AvatarPath);

                foreach (var attachment in comment.Comment.attechments)
                {
                    await attachment.SetFile(_previewService);
                }

                comment.Comment.SetAttachment(comment.Comment.attechments.ToArray());

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

        private async Task<object[]> GetCommunityPublictions(Guid id, DateTime lastPublictionTime, int count)
        {
            var comments = await _entities
                .Where(x => x.ItemId == id)
                .Join(
                    _context.Comments,
                    albumCommentLink => albumCommentLink.LinkedItemId,
                    comment => comment.Id,
                    (albumCommentLink, comment) => new { comment, albumCommentLink }
                )
                .Where(x => x.comment.Date < lastPublictionTime)
                .OrderByDescending(x => x.comment.Date)
                .Take(count)
                .Join(
                    _context.Communities,
                    prev => prev.albumCommentLink.ItemId,
                    user => user.Id,
                    (prev, user) => new { prev.comment, user }
                )
                .ToListAsync();

            foreach (var comment in comments)
            {
                comment.comment.SetAttachment(await _links
                    .Where(x => x.ItemId == comment.comment.Id)
                    .Join(_context.Attachments,
                        link => link.LinkedItemId,
                        attachment => attachment.Id,
                        (link, attachments) => attachments)
                    .ToArrayAsync());
            }

            var result = new List<object>();

            foreach (var comment in comments)
            {
                var avatar = await _fileService.ReadFileAsync(comment.user.Avatar);

                foreach (var attachment in comment.comment.attechments)
                {
                    await attachment.SetFile(_previewService);
                }

                comment.comment.SetAttachment(comment.comment.attechments.ToArray());

                if (avatar.IsSuccess)
                {
                    result.Add(new
                    {
                        comment.comment,
                        User = new
                        {
                            nickname = comment.user.Name,
                            Avatar = avatar.Value
                        }
                    });
                }
            }

            return result.ToArray();
        }
    }
}