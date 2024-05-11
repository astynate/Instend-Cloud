using Exider.Core;
using Exider.Repositories.Comments;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Comments
{
    [ApiController]
    [Route("[controller]")]
    public class AlbumCommentsController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        public AlbumCommentsController(IRequestHandler requestHandler)
        {
            _requestHandler = requestHandler;
        }

        [HttpGet]
        [Route("/api/album-comments")]
        public async Task<IActionResult> Get(ICommentLinkRepository commentsRepository, string? albumId)
        {
            if (string.IsNullOrEmpty(albumId) || string.IsNullOrWhiteSpace(albumId))
            {
                return BadRequest("Album not found");
            }

            var result = await commentsRepository.GetAsync(Guid.Parse(albumId));

            return Ok(result);
        }

        [HttpPost]
        [Route("/api/album-comments")]
        public async Task<IActionResult> Add(DatabaseContext context, ICommentsRepository commentsRepository, string? text, string? albumId)
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

            var result = await commentsRepository
                .AddComment(new AlbumCommentsLinkRepository(context), text, Guid.Parse(userId.Value), Guid.Parse(albumId));

            if (result.IsFailure)
            {
                return BadRequest(result.Error);
            }

            return Ok();
        }
    }
}
