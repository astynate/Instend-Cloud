using Exider.Repositories.Messenger;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace Exider_Version_2._0._0.Server.Controllers.Messenger
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly IMessengerReposiroty _messengerReposiroty;

        private readonly IRequestHandler _requestHandler;

        private readonly IHubContext<MessageHub> _messageHub;

        public MessageController(IMessengerReposiroty messengerReposiroty, IRequestHandler requestHandler, IHubContext<MessageHub> messageHub)
        {
            _messengerReposiroty = messengerReposiroty;
            _requestHandler = requestHandler;
            _messageHub = messageHub;
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMessage(Guid id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            var result = await _messengerReposiroty.DeleteMessage(id, Guid.Parse(userId.Value));

            if (result.IsFailure)
            {
                return Conflict(result.Error);
            }

            await _messageHub.Clients.Group(result.Value.ToString())
                .SendAsync("DeleteMessage", JsonConvert.SerializeObject(new { chatId = id, messageId = result.Value }));

            return Ok();
        }
    }
}
