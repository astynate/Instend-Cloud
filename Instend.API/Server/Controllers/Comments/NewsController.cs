using Instend.Core.Dependencies.Repositories.Account;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Comments
{
    [ApiController]
    [Route("[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly IAccountsRepository _usersRepository;

        public NewsController
        (
            IRequestHandler requestHandler, 
            IAccountsRepository usersRepository
        )
        {
            _requestHandler = requestHandler;
            _usersRepository = usersRepository;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/news")]
        public async Task<IActionResult> GetPublictions(string? lastPublicationDate)
        {
            //var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            //if (userId.IsFailure)
            //    return BadRequest(userId.Error);

            //Result<CommunityFollowerLink[]> followingCommunities = await _communityRepository.GetFollowingCommunities(Guid.Parse(userId.Value));

            //if (followingCommunities.IsFailure)
            //    return Conflict(followingCommunities.Error);

            //DateTime date = DateTime.Now;

            //if (lastPublicationDate != null)
            //    DateTime.TryParse(lastPublicationDate, out date);

            //Guid[] communities = followingCommunities.Value.Select(x => x.ItemId).ToArray();

            //return Ok(await _publicationRepository.GetLastCommentsAsync(communities, date, 7, Guid.Parse(userId.Value)));

            return Ok();
        }
    }
}