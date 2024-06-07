using Exider.Repositories.Comments;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Exider.Repositories.Account;
using static Exider.Core.Models.Links.AlbumLinks;
using Exider.Core.Dependencies.Repositories.Storage;
using Exider.Core;

namespace Exider_Version_2._0._0.Server.Controllers.Comments
{
    [ApiController]
    [Route("[controller]")]
    public class AlbumCommentsController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly ICommentsRepository<AlbumCommentLink, AttachmentCommentLink> _commentsRepository;

        private readonly ICommentBaseRepository _commentRepository;

        private readonly IHubContext<GalleryHub> _galleryHub;

        public AlbumCommentsController
        (
            IRequestHandler requestHandler,
            ICommentsRepository<AlbumCommentLink, AttachmentCommentLink> commentLinkRepository,
            IHubContext<GalleryHub> galleryHub,
            ICommentBaseRepository commentBaseRepository
        )
        {
            _requestHandler = requestHandler;
            _commentsRepository = commentLinkRepository;
            _galleryHub = galleryHub;
            _commentRepository = commentBaseRepository;
        }

        [HttpGet]
        [Route("/api/album-comments")]
        public async Task<IActionResult> Get(string? albumId)
        {
            if (string.IsNullOrEmpty(albumId) || string.IsNullOrWhiteSpace(albumId))
            {
                return BadRequest("Album not found");
            }

            var result = await _commentsRepository.GetAsync(Guid.Parse(albumId));

            return Ok(result);
        }

        [HttpPost]
        [Route("/api/album-comments")]
        public async Task<IActionResult> Add
        (
            ICommentsRepository<AlbumCommentLink, AttachmentCommentLink> commentsRepository,
            IUserDataRepository usersRepository,
            IAttachmentsRepository<AttachmentCommentLink> attachmentsRepository,
            [FromForm] string? text,
            [FromForm] IFormFile[] files,
            [FromForm] string? albumId,
            [FromForm] int queueId
        )
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            if (string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text))
                return BadRequest("Album not found");

            if (string.IsNullOrEmpty(albumId) || string.IsNullOrWhiteSpace(albumId))
                return BadRequest("Text is required");

            var result = await commentsRepository.AddComment(text, files, Guid.Parse(userId.Value), Guid.Parse(albumId));

            if (result.IsFailure)
                return BadRequest(result.Error);

            var user = await usersRepository.GetUserAsync(Guid.Parse(userId.Value));

            if (user.IsFailure)
                return BadRequest(user.Error);

            await _galleryHub.Clients.Group(albumId).SendAsync("AddComment",
                new
                {
                    comment = result.Value,
                    user = user.Value,
                    albumId,
                    queueId
                });

            return Ok();
        }

        [HttpDelete]
        [Route("/api/album-comments")]
        public async Task<IActionResult> Delete(string? id, string albumId)
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

            await _galleryHub.Clients.Group(albumId).SendAsync("DeleteComment", new { id, albumId });

            return Ok();
        }
    }
}