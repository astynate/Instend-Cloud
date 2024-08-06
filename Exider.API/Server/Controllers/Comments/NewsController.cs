using CSharpFunctionalExtensions;
using Exider.Core.Dependencies.Repositories.Account;
using Exider.Core.Models.Links;
using Exider.Repositories.Comments;
using Exider.Repositories.Public;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Exider.Core.Models.Links.AlbumLinks;

namespace Exider_Version_2._0._0.Server.Controllers.Comments
{
    [ApiController]
    [Route("[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly IUsersRepository _usersRepository;

        private readonly ICommunityRepository _communityRepository;

        private readonly ICommentsRepository<ComminityPublicationLink, AttachmentCommentLink> _publicationRepository;

        public NewsController
        (
            IRequestHandler requestHandler, 
            IUsersRepository usersRepository,
            ICommunityRepository communityRepository,
            ICommentsRepository<ComminityPublicationLink, AttachmentCommentLink> publicationRepository
        )
        {
            _requestHandler = requestHandler;
            _usersRepository = usersRepository;
            _communityRepository = communityRepository;
            _publicationRepository = publicationRepository;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/news")]
        public async Task<IActionResult> GetPublictions(string? lastPublitionDate)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            Result<CommunityFollowerLink[]> followingCommunities = await _communityRepository.GetFollowingCommunities(Guid.Parse(userId.Value));

            if (followingCommunities.IsFailure)
            {
                return Conflict(followingCommunities.Error);
            }

            List<object> comments = new List<object>();

            DateTime date = DateTime.Now;

            if (lastPublitionDate != null)
            {
                DateTime.TryParse(lastPublitionDate, out date);
            }

            foreach (CommunityFollowerLink community in followingCommunities.Value)
            {
                comments.AddRange(await _publicationRepository.GetLastCommentsAsync(community.ItemId, date, 7));
            }

            return Ok(comments);
        }
    }
}