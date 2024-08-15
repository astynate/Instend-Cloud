using Exider.Core.Dependencies.Repositories.Messenger;
using Exider.Core.Dependencies.Repositories.Storage;
using Exider.Core.Models.Messenger;
using Exider.Core.TransferModels.Messenger;
using Exider.Repositories.Messenger;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.Authorization;
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

        private readonly IDirectRepository _directRepository;

        private readonly IAttachmentsRepository<MessageAttachmentLink> _attachmentRepository;

        private readonly IChatBase[] _chatFactory = [];

        public MessageController
        (
            IMessengerReposiroty messengerReposiroty, 
            IRequestHandler requestHandler, 
            IHubContext<MessageHub> messageHub,
            IDirectRepository directRepository,
            IAttachmentsRepository<MessageAttachmentLink> attachmentRepository
        )
        {
            _messengerReposiroty = messengerReposiroty;
            _requestHandler = requestHandler;
            _messageHub = messageHub;
            _directRepository = directRepository;
            _chatFactory = [_directRepository];
            _attachmentRepository = attachmentRepository;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SendMessage([FromForm] MessageTransferModel model)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            if (model.id == Guid.Parse(userId.Value))
            {
                return BadRequest("Chat not found");
            }

            if (model.type >= 0 && model.type < _chatFactory.Length)
            {
                var result = await _chatFactory[model.type].SendMessage(Guid.Parse(userId.Value), model.id, model.text);

                if (result.IsFailure)
                {
                    return BadRequest(result.Error);
                }

                result.Value.queueId = model.queueId;

                if (model.attachments != null && model.attachments.Length > 0 && result.Value.messageModel != null)
                {
                    var attachments = await _attachmentRepository.AddAsync(model.attachments, Guid.Parse(userId.Value), result.Value.messageModel.Id);

                    if (attachments.IsSuccess)
                    {
                        result.Value.messageModel.attachments = attachments.Value;
                    }
                }

                if (result.Value.isChatCreated == true)
                {
                    await _messageHub.Clients.Group(userId.Value).SendAsync("NewConnection", result.Value.directModel.Id);
                    await _messageHub.Clients.Group(model.id.ToString()).SendAsync("NewConnection", result.Value.directModel.Id);
                }
                else
                {
                    await _messageHub.Clients.Group(result.Value.directModel.Id.ToString()).SendAsync("ReceiveMessage", JsonConvert.SerializeObject(result.Value));
                }
            }

            return Ok();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/message/view")]
        public async Task<IActionResult> ViewMessage(Guid id, Guid chatId)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            bool result = await _messengerReposiroty.ViewMessage(id, Guid.Parse(userId.Value));

            if (result == true)
            {
                await _messageHub.Clients.Group(chatId.ToString()).SendAsync("ViewMessage", new { id, chatId });
            }

            return Ok();
        }

        [HttpDelete]
        [Authorize]
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

        [HttpPut]
        [Authorize]
        public async Task ChangePinnedState(Guid chatId, Guid messageId, bool state)
        {
            bool result = await _messengerReposiroty
                .ChangePinnedState(messageId, state);

            if (result == false)
                return;

            await _messageHub.Clients.Group(chatId.ToString()).SendAsync("HandlePinnedStateChanges",
                JsonConvert.SerializeObject(new { chatId, messageId, state }));
        }
    }
}
