using Instend.Repositories.Comments;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.Hubs;
using Instend.Core.Models.Public;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Models.Account;
using Instend.Core.Models.Links;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using static Instend.Core.Models.Links.AlbumLinks;

namespace Instend_Version_2._0._0.Server.Controllers.Comments
{
    [ApiController]
    [Route("[controller]")]
    public class AlbumCommentsController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly IAccountsRepository _accountsRepository;

        private readonly IPublicationRepository<AlbumCommentLink, AttachmentCommentLink> _commentsRepository;

        private readonly IPublicationRepository<UserPublicationLink, AttachmentCommentLink> _userPublicationRepository;

        private readonly IPublicationBaseRepository<AttachmentCommentLink> _publicationsRepository;

        private readonly IHubContext<GalleryHub> _galleryHub;

        private delegate Task<Result<PublicationModel>> AddCommentDelegate(string text, IFormFile[] files, Guid ownerId, Guid itemId);

        private readonly AddCommentDelegate[] _addCommentHandlers = [];

        public AlbumCommentsController
        (
            IRequestHandler requestHandler,
            IAccountsRepository accountsRepository,
            IPublicationRepository<AlbumCommentLink, AttachmentCommentLink> commentLinkRepository,
            IHubContext<GalleryHub> galleryHub,
            IPublicationBaseRepository<AttachmentCommentLink> commentBaseRepository,
            IPublicationRepository<UserPublicationLink, AttachmentCommentLink> userPublicationRepository
        )
        {
            _requestHandler = requestHandler;
            _commentsRepository = commentLinkRepository;
            _galleryHub = galleryHub;
            _accountsRepository = accountsRepository;
            _publicationsRepository = commentBaseRepository;
            _userPublicationRepository = userPublicationRepository;
            _addCommentHandlers = [_commentsRepository.AddComment, _userPublicationRepository.AddComment];
        }

        [HttpGet]
        [Authorize]
        [Route("/api/album-comments")]
        public async Task<IActionResult> Get(string? albumId)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            if (string.IsNullOrEmpty(albumId) || string.IsNullOrWhiteSpace(albumId))
                return BadRequest("Album not found");

            var result = await _commentsRepository
                .GetLastCommentsAsync([Guid.Parse(albumId)], DateTime.Now, 10, Guid.Parse(userId.Value));

            return Ok(result);
        }

        [HttpGet]
        [Authorize]
        [Route("/api/user-publications")]
        public async Task<IActionResult> GetUserPublications(string? id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("User not found");

            var result = await _userPublicationRepository
                .GetLastCommentsAsync([Guid.Parse(id)], DateTime.Now, 10, Guid.Parse(userId.Value));

            return Ok(result);
        }

        private async Task<Result<(PublicationModel, AccountModel)>> Add([FromForm] string? text, [FromForm] IFormFile[] files, [FromForm] string? albumId, int type)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return Result.Failure<(PublicationModel, AccountModel)>(userId.Error);

            if (string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text))
                return Result.Failure<(PublicationModel, AccountModel)>("Album not found");

            if (string.IsNullOrEmpty(albumId) || string.IsNullOrWhiteSpace(albumId))
                return Result.Failure<(PublicationModel, AccountModel)>("Text is required");

            if (files.Length > 9)
                return Result.Failure<(PublicationModel, AccountModel)>("Maximum attechment count is 9");

            if (type < 0 || type > _addCommentHandlers.Length - 1)
                return Result.Failure<(PublicationModel, AccountModel)>("Invalid type");

            var result = await _addCommentHandlers[type](text, files, Guid.Parse(userId.Value), Guid.Parse(albumId));

            if (result.IsFailure)
                return Result.Failure<(PublicationModel, AccountModel)>(result.Error);

            var user = await _accountsRepository.GetByIdAsync(Guid.Parse(userId.Value));

            if (user == null)
                return Result.Failure<(PublicationModel, AccountModel)>("User not found");

            return (result.Value, user);
        }

        [HttpPost]
        [Authorize]
        [Route("/api/user/publications")]
        public async Task<IActionResult> AddUserPublication([FromForm] string? text, [FromForm] IFormFile[] files, [FromForm] string? albumId, [FromForm] int queueId)
        {
            var result = await Add(text, files, albumId, 2);

            if (result.IsFailure)
                return Conflict(result.Error);

            await _galleryHub.Clients
                .Group(albumId ?? "")
                .SendAsync(
                    "AddUserPublication",
                    new
                    {
                        comment = result.Value.Item1,
                        user = result.Value.Item2,
                        queueId
                    }
                );

            return Ok();
        }
    }
}