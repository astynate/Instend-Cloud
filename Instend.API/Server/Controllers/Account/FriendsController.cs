using Instend.Core.Dependencies.Repositories.Account;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers.Account
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

        [HttpPut]
        public async Task<IActionResult> SubmitFriendRequest(Guid id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            bool result = await _friendsRepository.SubmitRequestAsync(Guid.Parse(userId.Value), id);

            if (result == false)
                return Conflict("User not found");

            return Ok(new { userId = userId.Value, id });
        }

        [HttpPost]
        public async Task<IActionResult> SendFriend(Guid id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            if (id == Guid.Empty)
                return BadRequest("User not found");

            if (id == Guid.Parse(userId.Value))
                return BadRequest("You can't send a friend request to yourself");

            var result = await _friendsRepository.SendRequestAsync(id, Guid.Parse(userId.Value));

            if (result.IsFailure && result.Error == "0")
                return Ok(new { isRemove = true, userId = id, ownerId = userId.Value });

            if (result.IsFailure)
                return Conflict(result.Error);

            return Ok(result.Value);
        }
    }
}
