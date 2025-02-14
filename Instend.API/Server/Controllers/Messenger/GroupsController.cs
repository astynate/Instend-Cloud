using Instend.Repositories.Messenger;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Instend.Services.External.FileService;
using Microsoft.AspNetCore.Authorization;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Core.Models.Messenger.Group;

namespace Instend_Version_2._0._0.Server.Controllers.Messenger
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupsController : ControllerBase
    {
        private readonly IGroupsRepository _groupsRepository;

        private readonly IRequestHandler _requestHandler;

        private readonly IImageService _imageService;

        private readonly ISerializationHelper _serialyzer;

        private readonly IHubContext<GlobalHub> _messageHub;

        public GroupsController
        (
            IGroupsRepository groupsRepository,
            IRequestHandler requestHandler,
            IHubContext<GlobalHub> messageHub,
            IImageService imageService,
            ISerializationHelper serialyzer
        )
        {
            _groupsRepository = groupsRepository;
            _requestHandler = requestHandler;
            _messageHub = messageHub;
            _imageService = imageService;
            _serialyzer = serialyzer;
        }

        [HttpGet]
        [Route("/api/groups/all")]
        [Authorize]
        public async Task<ActionResult<Group>> GetGroups(int skip, int take)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var result = await _groupsRepository
                .GetAccountGroups(Guid.Parse(userId.Value), skip, take);

            return Ok(_serialyzer.SerializeWithCamelCase(result));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Group>> CreateGroup([FromForm] string name, [FromForm] IFormFile avatar, [FromForm] string connectionId)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            using (MemoryStream stream = new MemoryStream())
            {
                await avatar.CopyToAsync(stream);

                var nameSplited = avatar.FileName.Split(".");
                var type = nameSplited.LastOrDefault();

                var result = await _groupsRepository
                    .Create(name, stream.ToArray(), type ?? "", Guid.Parse(userId.Value));

                if (result.IsFailure)
                    return Conflict(result.Error);

                await _messageHub.Groups
                    .AddToGroupAsync(connectionId, result.Value.Id.ToString());

                return Ok(_serialyzer.SerializeWithCamelCase(result.Value));
            }
        }

        [HttpPut]
        [Authorize]
        [Route("add/members")]
        public async Task<ActionResult> AddGroupMembers([FromQuery] Guid id, [FromQuery] Guid[] ids)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var group = await _groupsRepository.GetByIdAsync(id, Guid.Parse(userId.Value), DateTime.Now, 1);

            if (ids.Length == 0)
                return Conflict("Accounts list is empthy");

            if (group == null)
                return Conflict("Group not found");

            var isAccountOwner = group.Members
                .Where(x => x.AccountId == Guid.Parse(userId.Value) && x.Role == Instend.Core.Configuration.GroupRoles.Owner)
                .Any();

            if (isAccountOwner == false)
                return Conflict("You have not permissions to perform this operation.");

            var result = await _groupsRepository.AddGroupMembers(id, ids);

            if (result.IsFailure)
                return Conflict(result.Error);

            foreach (var user in result.Value)
            {
                await _messageHub.Clients
                    .Group(id.ToString())
                    .SendAsync("AddMember", _serialyzer.SerializeWithCamelCase(user));

                await _messageHub.Clients
                    .Group(user.AccountId.ToString())
                    .SendAsync("ConnetToGroup", id);
            }

            return Ok();
        }

        [HttpPut]
        [Authorize]
        [Route("remove/member")]
        public async Task<ActionResult> RemoveGroupMember([FromQuery] Guid id, [FromQuery] Guid accountId)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var group = await _groupsRepository.GetByIdAsync(id, Guid.Parse(userId.Value), DateTime.Now, 1);

            if (group == null)
                return Conflict("Group not found");

            var isAccountOwner = group.Members
                .Where(x => x.AccountId == Guid.Parse(userId.Value) && x.Role == Instend.Core.Configuration.GroupRoles.Owner)
                .Any();

            if (group.Members.Count() == 1)
            {
                await DeleteGroup(id);
                return Ok();
            }

            if (isAccountOwner == false)
                return Conflict("You have not permissions to perform this operation.");

            var result = await _groupsRepository
                .RemoveMember(group, accountId);

            if (result.IsFailure)
                return Conflict(result.Error);

            await _messageHub.Clients
                .Group(id.ToString())
                .SendAsync("RemoveMember", new { id, accountId });

            return Ok();
        }

        [HttpGet]
        [Authorize]
        [Route("/api/groups")]
        public async Task<IActionResult> GetLastMessages(Guid id, DateTime date, int take = 5)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var messages = await _groupsRepository
                .GetByIdAsync(id, Guid.Parse(userId.Value), date, take);

            if (messages == null)
                return Conflict("Group not found");

            return Ok(_serialyzer.SerializeWithCamelCase(messages));
        }

        [HttpDelete]
        [Authorize]
        [Route("/api/groups")]
        public async Task<IActionResult> DeleteGroup(Guid id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var result = await _groupsRepository
                .DeleteGroupAsync(id, Guid.Parse(userId.Value));

            if (result.IsFailure)
                return Conflict("Group not found");

            return Ok();
        }
    }
}