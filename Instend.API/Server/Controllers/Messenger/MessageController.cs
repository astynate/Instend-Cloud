using Instend.Core.Dependencies.Repositories.Messenger;
using Instend.Core.TransferModels.Messenger;
using Instend.Repositories.Messenger;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.Hubs;
using Instend.Repositories.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Core.Models.Messenger.Direct;
using Instend.Core.Models.Messenger.Group;

namespace Instend_Version_2._0._0.Server.Controllers.Messenger
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly IMessengerRepository _messengerReposiroty;

        private readonly IRequestHandler _requestHandler;

        private readonly IHubContext<GlobalHub> _messageHub;

        private readonly IDirectRepository _directRepository;

        private readonly ISerializationHelper _serializator;

        private readonly IGroupsRepository _groupRepository;

        private readonly IStorageAttachmentRepository _storageAttachmentRepository;

        private readonly IChatBase[] _chatFactory = [];

        public MessageController
        (
            IMessengerRepository messengerReposiroty, 
            IRequestHandler requestHandler, 
            IHubContext<GlobalHub> messageHub,
            IDirectRepository directRepository,
            IStorageAttachmentRepository storageAttachmentRepository,
            ISerializationHelper serializator,
            IGroupsRepository group
        )
        {
            _messengerReposiroty = messengerReposiroty;
            _requestHandler = requestHandler;
            _messageHub = messageHub;
            _directRepository = directRepository;
            _groupRepository = group;
            _chatFactory = [_directRepository, _groupRepository];
            _storageAttachmentRepository = storageAttachmentRepository;
            _serializator = serializator;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SendMessage([FromForm] MessageTransferModel model)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            if (model.id == Guid.Parse(userId.Value))
                return BadRequest("Chat not found");

            if (model.type < 0 && model.type > _chatFactory.Length)
                return BadRequest("Invalid type");

            var result = await _chatFactory[model.type]
                .SendMessage(Guid.Parse(userId.Value), model.id, model.text);

            if (result.IsFailure)
                return BadRequest(result.Error);

            switch (result.Value)
            {
                case Direct direct:
                {
                    await HandleDirectMessgeSend(direct); break;
                }
                case Group group:
                {
                    if (group != null)
                        await NotifyAboutMessage(group, group.Id.ToString());

                    break;
                }
            }

            return Ok();
        }

        private async Task HandleDirectMessgeSend(Direct direct)
        {
            if (direct.IsAccepted == false)
            {
                await _messageHub.Clients.Group(direct.AccountModelId.ToString())
                    .SendAsync("NewConnection", direct.Id);

                await _messageHub.Clients.Group(direct.OwnerId.ToString())
                    .SendAsync("NewConnection", direct.Id);

                return;
            }

            await NotifyAboutMessage(direct, direct.Id.ToString());
        }

        private async Task NotifyAboutMessage(object transferModel, string id)
        {
            await _messageHub.Clients.Group(id)
                .SendAsync("ReceiveMessage", _serializator.SerializeWithCamelCase(transferModel));
        }

        [HttpPost]
        [Authorize]
        [Route("/api/message/view")]
        public async Task<IActionResult> ViewMessage(Guid id, Guid chatId)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var result = await _messengerReposiroty.ViewMessage(id, Guid.Parse(userId.Value));

            if (result == true)
                await _messageHub.Clients.Group(chatId.ToString()).SendAsync("ViewMessage", new { id, chatId });

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteMessage(Guid id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var result = await _messengerReposiroty
                .DeleteMessage(id, Guid.Parse(userId.Value));

            if (result == false)
                return Conflict("An error occurred while trying to delete a message.");

            await _messageHub.Clients.Group(id.ToString())
                .SendAsync("DeleteMessage", _serializator.SerializeWithCamelCase(new { chatId = id, messageId = id }));

            return Ok();
        }
    }
}