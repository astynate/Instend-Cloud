using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Repositories.Messenger;
using Instend.Repositories.Contexts;

namespace Instend_Version_2._0._0.Server.Controllers.Messenger
{
    [ApiController]
    [Route("api/[controller]")]
    public class DirectsController : ControllerBase
    {
        private readonly IDirectRepository _directRepository;

        private readonly IHubContext<GlobalHub> _messageHub;

        private readonly IRequestHandler _requestHandler;

        private readonly GlobalContext _context;

        private readonly ISerializationHelper _serialyzer;

        public DirectsController
        (
            GlobalContext context,
            IDirectRepository directRepository,
            IRequestHandler requestHandler,
            IHubContext<GlobalHub> messageHub,
            ISerializationHelper serialyzer
        )
        {
            _context = context;
            _directRepository = directRepository;
            _requestHandler = requestHandler;
            _messageHub = messageHub;
            _serialyzer = serialyzer;
        }

        [HttpGet]
        [Route("/api/[controller]/all")]
        [Authorize]
        public async Task<IActionResult> GetDirects(int skip, int take)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var direct = await _directRepository
                .GetAccountDirectsAsync(Guid.Parse(userId.Value), skip, take);

            if (direct == null)
                return Conflict("Direct not found");

            return Ok(_serialyzer.SerializeWithCamelCase(direct));
        }

        [HttpPut]
        [Route("/api/[controller]/accept")]
        [Authorize]
        public async Task<IActionResult> AcceptDirect(Guid id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var direct = await _directRepository
                .AcceptDirect(id, Guid.Parse(userId.Value));

            if (direct == false)
                return Conflict("Direct not found");

            await _messageHub.Clients
                .Group(id.ToString())
                .SendAsync("AcceptDirect", id.ToString());

            return Ok();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetLastMessages(Guid id, DateTime date, int take = 5)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var direct = await _directRepository
                .GetAsync(id, date, take);

            if (direct == null)
                return Conflict("Direct not found");

            return Ok(_serialyzer.SerializeWithCamelCase(direct));
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteDirect(Guid accountId)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var result = await _directRepository.DeleteDirect
            (
                accountId, 
                Guid.Parse(userId.Value)
            );

            if (result.IsFailure)
                return BadRequest(result.Error);

            await _messageHub.Clients
                .Group(result.Value.ToString())
                .SendAsync("DeleteDirect", result.Value.ToString());
        
            return Ok();
        }
    }
}