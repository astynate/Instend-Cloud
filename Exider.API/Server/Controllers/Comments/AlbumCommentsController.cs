using Exider.Core.Models.Comments;
using Exider.Repositories.Comments;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Exider.Core.Dependencies.Repositories.Account;

namespace Exider_Version_2._0._0.Server.Controllers.Comments
{
    [ApiController]
    [Route("[controller]")]
    public class AlbumCommentsController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly ICommentsRepository<AlbumCommentLink> _commentsRepository;

        private readonly IHubContext<GalleryHub> _galleryHub;

        public AlbumCommentsController
        (
            IRequestHandler requestHandler, 
            ICommentsRepository<AlbumCommentLink> commentLinkRepository,
            IHubContext<GalleryHub> galleryHub
        )
        {
            _requestHandler = requestHandler;
            _commentsRepository = commentLinkRepository;
            _galleryHub = galleryHub;
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
            ICommentsRepository<AlbumCommentLink> commentsRepository, 
            IUsersRepository usersRepository, 
            string? text, 
            string? albumId,
            int queueId
        )
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            if (string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text))
            {
                return BadRequest("Album not found");
            }

            if (string.IsNullOrEmpty(albumId) || string.IsNullOrWhiteSpace(albumId))
            {
                return BadRequest("Text is required");
            }

            var result = await commentsRepository.AddComment(text, Guid.Parse(userId.Value), Guid.Parse(albumId));

            if (result.IsFailure)
            {
                return BadRequest(result.Error);
            }

            var user = await usersRepository.GetUserByIdAsync(Guid.Parse(userId.Value));

            if (user == null)
            {
                return BadRequest("User not found");
            }

            await _galleryHub.Clients.Group(albumId).SendAsync("AddComment", 
                new { 
                    comment = result.Value, 
                    user = new 
                    { 
                        user.Id, 
                        user.Name, 
                        user.Surname,
                        user.Nickname, 
                        user.Email 
                    },
                    albumId,
                    queueId
                });

            return Ok();
        }
    }
}