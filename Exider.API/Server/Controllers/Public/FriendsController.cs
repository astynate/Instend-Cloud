using Exider.Repositories.Public;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Public
{
    [ApiController]
    [Route("api/[controller]")]
    public class FriendsController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly IFriendsRepository _friendsRepository;

        public FriendsController
        (
            IRequestHandler requestHandler,
            IFriendsRepository friendsRepository
        )
        {
            _requestHandler = requestHandler;
            _friendsRepository = friendsRepository;
        }

        [HttpPost]
        public async Task<IActionResult> SendFriend(Guid id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            if (id == Guid.Empty)
                return BadRequest("User not found");

            var result = await _friendsRepository.SendRequestAsync(id, Guid.Parse(userId.Value));

            if (result.IsFailure)
            {
                return Conflict(result.Error);
            }

            return Ok();
        }
    }
}
