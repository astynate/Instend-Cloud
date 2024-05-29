using Exider.Repositories.Messenger;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Messenger
{
    [ApiController]
    [Route("api/[controller]")]
    public class DirectController : ControllerBase
    {
        private readonly IDirectRepository _directRepository;

        private readonly IHubContext<MessageHub> _messageHub;

        public DirectController(IDirectRepository directRepository)
        {
            _directRepository = directRepository;
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