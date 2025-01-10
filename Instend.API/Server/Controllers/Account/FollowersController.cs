using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers.Account
{
    [ApiController]
    [Route("api/[controller]")]
    public class FollowersController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly ISerializationHelper _serialiationHelper;

        private readonly IFollowersRepository _friendsRepository;

        public FollowersController
        (
            IRequestHandler requestHandler,
            ISerializationHelper serialiationHelper,
            IFollowersRepository friendsRepository
        )
        {
            _serialiationHelper = serialiationHelper;
            _requestHandler = requestHandler;
            _friendsRepository = friendsRepository;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ChangeFollowingState(Guid id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            if (id == Guid.Empty)
                return BadRequest("User not found");

            if (id == Guid.Parse(userId.Value))
                return BadRequest("You can't send a friend request to yourself");

            var result = await _friendsRepository
                .ChangeFollowingState(id, Guid.Parse(userId.Value));

            if (result.IsFailure && result.Error == "0")
                return Ok(new { isRemove = true, userId = id, ownerId = userId.Value });

            if (result.IsFailure)
                return Conflict(result.Error);

            if (result.Value != null)
                return Ok(_serialiationHelper.SerializeWithCamelCase(result.Value));

            return Ok();
        }
    }
}