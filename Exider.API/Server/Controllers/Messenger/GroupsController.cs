using Exider.Core.Models.Messenger;
using Exider.Repositories.Messenger;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Exider.Services.External.FileService;

namespace Exider_Version_2._0._0.Server.Controllers.Messenger
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupsController : ControllerBase
    {
        private readonly IGroupsRepository _groupsRepository;

        private readonly IRequestHandler _requestHandler;

        private readonly IImageService _imageService;

        private readonly IHubContext<MessageHub> _messageHub;

        public GroupsController
        (
            IGroupsRepository groupsRepository, 
            IRequestHandler requestHandler, 
            IHubContext<MessageHub> messageHub,
            IImageService imageService
        )
        {
            _groupsRepository = groupsRepository;
            _requestHandler = requestHandler;
            _messageHub = messageHub;
            _imageService = imageService;
        }

        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult<GroupModel>> CreateGroup([FromForm] string name, [FromForm] IFormFile avatar, [FromForm] string connectionId)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            using (MemoryStream stream = new MemoryStream())
            {
                await avatar.CopyToAsync(stream);

                var result = await _groupsRepository
                    .Create(name, stream.ToArray(), Guid.Parse(userId.Value));

                if (result.IsFailure)
                {
                    return Conflict(result.Error);
                }

                result.Value.Avatar = _imageService
                    .CompressImage(stream.ToArray(), 5, "png");

                await _messageHub.Groups
                    .AddToGroupAsync(connectionId, result.Value.Id.ToString());

                return Ok(JsonConvert.SerializeObject(result.Value));
            }
        }

        [HttpPost]
        [Route("members")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult> LeaveGroup([FromForm] Guid id, [FromForm] Guid[] users)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            if (users.Length > 0)
            {
                var group = await _groupsRepository.GetGroup(id, Guid.Parse(userId.Value));

                if (group == null)
                {
                    return Conflict("Group not found");
                }

                var result = await _groupsRepository.SetGroupMembers(id, users);

                if (result.IsFailure) 
                {  
                    return Conflict(result.Error);
                }

                foreach (var user in result.Value.membersToAdd) 
                {
                    await _messageHub.Clients
                        .Group(user.ToString())
                        .SendAsync("ConnetToGroup", id);
                }

                foreach (var user in result.Value.membersToDelete)
                {
                    await _messageHub.Clients
                        .Group(id.ToString())
                        .SendAsync("LeaveGroup", JsonConvert.SerializeObject(new { id, user }));
                }
            }

            return Ok();
        }
    }
}