using Exider.Core.Dependencies.Repositories.Messenger;
using Exider.Core.TransferModels;
using Exider.Core.TransferModels.Messenger;
using Exider.Repositories.Messenger;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System.Net;

namespace Exider_Version_2._0._0.Server.Hubs
{
    public class MessageHub : Hub
    {
        private readonly IRequestHandler _requestHandler;

        private readonly IMessengerReposiroty _messengerReposiroty;

        private readonly IDirectRepository _directRepository;

        private readonly IFileService _fileService;

        private readonly IChatBase[] _chatFactory = [];

        public MessageHub
        (
            IRequestHandler requestHandler, 
            IMessengerReposiroty messengerReposiroty, 
            IFileService fileService, 
            IDirectRepository directRepository
        )
        {
            _requestHandler = requestHandler;
            _messengerReposiroty = messengerReposiroty;
            _fileService = fileService;
            _directRepository = directRepository;
            _chatFactory = [_directRepository];
        }

        public async Task SendMessage(MessageTransferModel model)
        {
            var userId = _requestHandler.GetUserId(model.userId);

            if (userId.IsFailure)
            {
                return;
            }

            if (model.id == Guid.Parse(userId.Value))
            {
                return;
            }

            if (model.type >= 0 && model.type < _chatFactory.Length)
            {
                var result = await _chatFactory[model.type].SendMessage(model.id, Guid.Parse(userId.Value), model.text);
                
                if (result.IsFailure)
                {
                    return;
                }

                if (result.Value.isChatCreated == true)
                {
                    await Clients.Group(userId.Value).SendAsync("NewConnection", result.Value.directModel.Id);
                    await Clients.Group(model.id.ToString()).SendAsync("NewConnection", result.Value.directModel.Id);
                }
                else
                {
                    await Clients.Group(result.Value.directModel.Id.ToString()).SendAsync("ReceiveMessage", JsonConvert.SerializeObject(result.Value));
                }
            }
        }

        public async Task Join(string authorization)
        {
            var userId = _requestHandler.GetUserId(authorization);

            if (userId.IsFailure)
            {
                return;
            }

            MessengerTransferModel[] directs = await _messengerReposiroty.GetDirects(_fileService, Guid.Parse(userId.Value));

            foreach (MessengerTransferModel directory in directs)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, directory.directModel.Id.ToString());
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, userId.Value);
            await Clients.Caller.SendAsync("GetChats", JsonConvert.SerializeObject(new { directs }));
        }

        public async Task ConnectToDirect(Guid id, string authorization)
        {
            var userId = _requestHandler.GetUserId(authorization);

            if (userId.IsFailure)
            {
                return;
            }

            MessengerTransferModel? direct = await _messengerReposiroty.GetDirect(_fileService, id, Guid.Parse(userId.Value));

            if (direct == null)
            {
                return;
            }

            await Groups.AddToGroupAsync(direct.directModel.Id.ToString(), direct.directModel.Id.ToString());
            await Clients.Caller.SendAsync("ReceiveMessage", JsonConvert.SerializeObject(direct));
        }
    }
}