using Exider.Repositories.Comments;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Exider.Repositories.Account;
using static Exider.Core.Models.Links.AlbumLinks;
using Exider.Core.Models.Links;
using Exider.Core.Models.Comments;
using Exider.Core.TransferModels.Account;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Authorization;
using DocumentFormat.OpenXml.Spreadsheet;

namespace Exider_Version_2._0._0.Server.Controllers.Comments
{
    [ApiController]
    [Route("[controller]")]
    public class AlbumCommentsController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly ICommentsRepository<AlbumCommentLink, AttachmentCommentLink> _commentsRepository;

        private readonly ICommentsRepository<ComminityPublicationLink, AttachmentCommentLink> _publicationRepository;

        private readonly ICommentsRepository<UserPublicationLink, AttachmentCommentLink> _userPublicationRepository;

        private readonly ICommentBaseRepository<AttachmentCommentLink> _commentRepository;

        private readonly IHubContext<GalleryHub> _galleryHub;

        public AlbumCommentsController
        (
            IRequestHandler requestHandler,
            ICommentsRepository<AlbumCommentLink, AttachmentCommentLink> commentLinkRepository,
            ICommentsRepository<ComminityPublicationLink, AttachmentCommentLink> publicationRepository,
            IHubContext<GalleryHub> galleryHub,
            ICommentBaseRepository<AttachmentCommentLink> commentBaseRepository,
            ICommentsRepository<UserPublicationLink, AttachmentCommentLink> userPublicationRepository
        )
        {
            _requestHandler = requestHandler;
            _commentsRepository = commentLinkRepository;
            _galleryHub = galleryHub;
            _commentRepository = commentBaseRepository;
            _publicationRepository = publicationRepository;
            _userPublicationRepository = userPublicationRepository;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/album-comments")]
        public async Task<IActionResult> Get(string? albumId)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            if (string.IsNullOrEmpty(albumId) || string.IsNullOrWhiteSpace(albumId))
            {
                return BadRequest("Album not found");
            }

            var result = await _commentsRepository.GetLastCommentsAsync([Guid.Parse(albumId)], DateTime.Now, 10, Guid.Parse(userId.Value));

            return Ok(result);
        }

        [HttpGet]
        [Authorize]
        [Route("/api/user-publications")]
        public async Task<IActionResult> GetUserPublications(string? id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("User not found");
            }

            var result = await _userPublicationRepository.GetLastCommentsAsync([Guid.Parse(id)], DateTime.Now, 10, Guid.Parse(userId.Value));

            return Ok(result);
        }

        private async Task<Result<(CommentModel, UserPublic)>> Add
        (
            IUserDataRepository usersRepository,
            [FromForm] string? text,
            [FromForm] IFormFile[] files,
            [FromForm] string? albumId,
            int type
        )
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return Result.Failure<(CommentModel, UserPublic)>(userId.Error);

            if (string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text))
                return Result.Failure<(CommentModel, UserPublic)>("Album not found");

            if (string.IsNullOrEmpty(albumId) || string.IsNullOrWhiteSpace(albumId))
                return Result.Failure<(CommentModel, UserPublic)>("Text is required");

            if (files.Length > 9)
                return Result.Failure<(CommentModel, UserPublic)>("Maximum attechment count is 9");

            Result<CommentModel> result = Result.Failure<CommentModel>("Invalid operation type");

            switch (type)
            {
                case 0:
                {
                    result = await _commentsRepository.AddComment(text, files, Guid.Parse(userId.Value), Guid.Parse(albumId));
                    break;
                }
                case 1:
                {
                    result = await _publicationRepository.AddComment(text, files, Guid.Parse(userId.Value), Guid.Parse(albumId));
                    break;
                }
                case 2:
                {
                    result = await _userPublicationRepository.AddComment(text, files, Guid.Parse(userId.Value), Guid.Parse(albumId));
                    break;
                }
            }

            if (result.IsFailure)
                return Result.Failure<(CommentModel, UserPublic)>(result.Error);

            var user = await usersRepository.GetUserAsync(Guid.Parse(userId.Value));

            if (user.IsFailure)
                return Result.Failure<(CommentModel, UserPublic)>(user.Error);

            return (result.Value, user.Value);
        }

        [HttpPost]
        [Authorize]
        [Route("/api/album-comments")]
        public async Task<IActionResult> AddAlbumComment
        (
            IUserDataRepository usersRepository,
            [FromForm] string? text,
            [FromForm] IFormFile[] files,
            [FromForm] string? albumId,
            [FromForm] int queueId
        )
        {
            Result<(CommentModel, UserPublic)> result = await Add(usersRepository, text, files, albumId, 0);

            if (result.IsFailure)
            {
                return Conflict(result.Error);
            }

            await _galleryHub.Clients.Group(albumId).SendAsync("AddComment",
                new
                {
                    comment = result.Value.Item1,
                    user = result.Value.Item2,
                    albumId,
                    queueId
                });

            return Ok();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/community/publications")]
        public async Task<IActionResult> AddCommunityPublication
        (
            IUserDataRepository usersRepository,
            [FromForm] string? text,
            [FromForm] IFormFile[] files,
            [FromForm] string? albumId,
            [FromForm] int queueId
        )
        {
            Result<(CommentModel, UserPublic)> result = await Add(usersRepository, text, files, albumId, 1);

            if (result.IsFailure)
            {
                return Conflict(result.Error);
            }

            await _galleryHub.Clients.Group(albumId).SendAsync("AddPublication",
                new
                {
                    comment = result.Value.Item1,
                    user = result.Value.Item2,
                    albumId,
                    queueId
                });

            return Ok();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/user/publications")]
        public async Task<IActionResult> AddUserPublication
        (
            IUserDataRepository usersRepository,
            [FromForm] string? text,
            [FromForm] IFormFile[] files,
            [FromForm] string? albumId,
            [FromForm] int queueId
        )
        {
            Result<(CommentModel, UserPublic)> result = await Add(usersRepository, text, files, albumId, 2);

            if (result.IsFailure)
            {
                return Conflict(result.Error);
            }

            await _galleryHub.Clients.Group(albumId).SendAsync("AddUserPublication",
                new
                {
                    comment = result.Value.Item1,
                    user = result.Value.Item2,
                    queueId
                });

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        [Route("/api/album-comments")]
        public async Task<IActionResult> Delete(string? id, string albumId, int type = 0)
        {
            if (string.IsNullOrEmpty(albumId) || string.IsNullOrWhiteSpace(albumId))
            {
                return BadRequest("Album not found");
            }

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Comment not found");
            }

            var result = await _commentRepository.DeleteAsync(Guid.Parse(id));

            if (result.IsFailure)
            {
                return Conflict(result.Error);
            }

            switch (type)
            {
                case 0:
                    await _galleryHub.Clients.Group(albumId).SendAsync("DeleteComment", id);
                    break;
                case 1:
                    await _galleryHub.Clients.Group(albumId).SendAsync("DeletePublication", id);
                    break;
                case 2:
                    await _galleryHub.Clients.Group(albumId).SendAsync("DeleteUserPublication", id);
                    break;
            }

            return Ok();
        }
    }
}