using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Repositories.Messenger;

namespace Instend_Version_2._0._0.Server.Controllers.Messenger
{
    [ApiController]
    [Route("api/[controller]")]
    public class DirectController : ControllerBase
    {
        private readonly IDirectRepository _directRepository;

        private readonly IHubContext<MessageHub> _messageHub;
        
        private readonly IRequestHandler _requestHandler;

        private readonly ISerializationHelper _serialyzer;

        public DirectController
        (
            IDirectRepository directRepository, 
            IRequestHandler requestHandler,
            IHubContext<MessageHub> messageHub,
            ISerializationHelper serialyzer
        )
        {
            _directRepository = directRepository;
            _requestHandler = requestHandler;
            _messageHub = messageHub;
            _serialyzer = serialyzer;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/directs")]
        public async Task<IActionResult> GetLastMessages(Guid destination, int from, int count)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var messages = await _directRepository
                .GetAsync(destination, Guid.Parse(userId.Value), from, count);

            return Ok(_serialyzer.SerializeWithCamelCase(messages));
        }

        [Authorize]
        [HttpDelete]
        [Route("/api/directs")]
        public async Task<IActionResult> DeleteDirect(Guid id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var result = await _directRepository
                .DeleteDirect(id, Guid.Parse(userId.Value));

            if (result.IsFailure)
                return BadRequest(result.Error);

            await _messageHub.Clients.Group(result.Value.ToString())
                .SendAsync("DeleteDirectory", result.Value.ToString());
        
            return Ok();
        }
    }
}