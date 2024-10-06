using DocumentFormat.OpenXml.Spreadsheet;
using Exider.Core.Dependencies.Repositories.Messenger;
using Exider.Core.Dependencies.Repositories.Storage;
using Exider.Core.Models.Messenger;
using Exider.Core.TransferModels;
using Exider.Core.TransferModels.Messenger;
using Exider.Repositories.Messenger;
using Exider.Services.Internal;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Instend.Repositories.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Exider_Version_2._0._0.Server.Controllers.Messenger
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly IMessengerRepository _messengerReposiroty;

        private readonly IRequestHandler _requestHandler;

        private readonly IHubContext<MessageHub> _messageHub;

        private readonly IDirectRepository _directRepository;

        private readonly ISerializationHelper _serializator;

        private readonly IGroupsRepository _groupRepository;

        private readonly IStorageAttachmentRepository _storageAttachmentRepository;

        private readonly IAttachmentsRepository<MessageAttachmentLink> _attachmentRepository;

        private readonly IChatBase[] _chatFactory = [];

        public MessageController
        (
            IMessengerRepository messengerReposiroty, 
            IRequestHandler requestHandler, 
            IHubContext<MessageHub> messageHub,
            IDirectRepository directRepository,
            IAttachmentsRepository<MessageAttachmentLink> attachmentRepository,
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
            _attachmentRepository = attachmentRepository;
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

            result.Value.queueId = model.queueId;

            if (model.attachments != null && model.attachments.Length > 0 && result.Value.messageModel != null)
            {
                var attachments = await _attachmentRepository.AddAsync(model.attachments, Guid.Parse(userId.Value), result.Value.messageModel.Id);

                if (attachments.IsSuccess)
                {
                    result.Value.messageModel.attachments = attachments.Value;
                }
            }

            if (result.Value.messageModel != null && model.fileIds != null || model.folderIds != null)
            {
                await _storageAttachmentRepository.AddStorageMessageLinks(
                    model.folderIds ?? [],
                    model.fileIds ?? [],
                    result.Value.messageModel!.Id,
                    Request.Headers["Authorization"]!
                );
            }

            switch (result.Value)
            {
                case DirectTransferModel direct:
                {
                    await HandleDirectMessgeSend(direct); break;
                }
                case GroupTransferModel group:
                {
                    if (group.model != null)
                    {
                        await NotifyAboutMessage(group, group.model.Id.ToString());
                    }

                    break;
                }
            }

            return Ok();
        }

        private async Task HandleDirectMessgeSend(DirectTransferModel direct)
        {
            if (direct.isChatCreated)
            {
                await _messageHub.Clients.Group(direct.model.UserId.ToString())
                    .SendAsync("NewConnection", direct.model.Id);

                await _messageHub.Clients.Group(direct.model.OwnerId.ToString())
                    .SendAsync("NewConnection", direct.model.Id);

                return;
            }

            await NotifyAboutMessage(direct, direct.model.Id.ToString());
        }

        private async Task NotifyAboutMessage(MessengerTransferModelBase transferModel, string id)
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
                .SendAsync("DeleteMessage", _serializator.SerializeWithCamelCase(new { chatId = id, messageId = result.Value }));

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
                _serializator.SerializeWithCamelCase(new { chatId, messageId, state }));
        }
    }
}
