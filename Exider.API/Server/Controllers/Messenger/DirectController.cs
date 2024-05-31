using Exider.Core.Models.Messages;
using Exider.Repositories.Messenger;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OpenXmlPowerTools.Commands;

namespace Exider_Version_2._0._0.Server.Controllers.Messenger
{
    [ApiController]
    [Route("api/[controller]")]
    public class DirectController : ControllerBase
    {
        private readonly IDirectRepository _directRepository;

        private readonly IHubContext<MessageHub> _messageHub;
        
        private readonly IRequestHandler _requestHandler;

        public DirectController(IDirectRepository directRepository, IRequestHandler requestHandler)
        {
            _directRepository = directRepository;
            _requestHandler = requestHandler;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/directs")]
        public async Task<IActionResult> GetLastMessages(Guid destination, int from, int count)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            MessageModel[] messages = await _directRepository
                .GetLastMessages(destination, Guid.Parse(userId.Value), from, count);

            return Ok(JsonConvert.SerializeObject(messages));
        }

        [HttpPost]
        public async Task<IActionResult> CreateDirect(Guid userId, Guid ownerId, string text)
        {
            var direct = await _directRepository.CreateNewDiret(userId, ownerId);

            if (direct.IsFailure)
            {
                return BadRequest(direct.Error);
            }

            var message = await _directRepository.SendMessage(ownerId, userId, text);

            if (message.IsFailure)
            {
                return Conflict(message.Error);
            }

            var messageValue = message.Value;

            return Ok();
        }
    }
}