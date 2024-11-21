using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Messenger;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Core.TransferModels.Messenger;
using Instend.Repositories.Messenger;
using Instend.Services.External.FileService;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace Instend_Version_2._0._0.Server.Hubs
{
    public class MessageHub : Hub
    {
        private readonly IRequestHandler _requestHandler;

        private readonly IMessengerRepository _messengerReposiroty;

        private readonly IDirectRepository _directRepository;

        private readonly IGroupsRepository _groupsRepository;

        private readonly ISerializationHelper _serializator;

        private readonly IFileService _fileService;

        private readonly IChatBase[] _chatFactory = [];

        public MessageHub
        (
            IRequestHandler requestHandler, 
            IMessengerRepository messengerReposiroty, 
            IFileService fileService, 
            IDirectRepository directRepository,
            IGroupsRepository groupsRepository,
            ISerializationHelper serializator
        )
        {
            _requestHandler = requestHandler;
            _messengerReposiroty = messengerReposiroty;
            _fileService = fileService;
            _directRepository = directRepository;
            _chatFactory = [_directRepository];
            _groupsRepository = groupsRepository;
            _serializator = serializator;
        }

        public record JoinTransferModel(string authorization, int count);

        public async Task Join(JoinTransferModel anonymousObject)
        {
            var userId = _requestHandler.GetUserId(anonymousObject.authorization);

            if (userId.IsFailure)
            {
                return;
            }

            DirectTransferModel[] directs = await _messengerReposiroty.GetDirects(_fileService, Guid.Parse(userId.Value), anonymousObject.count);
            GroupTransferModel[] groups = await _groupsRepository.GetUserGroups(Guid.Parse(userId.Value), anonymousObject.count);

            foreach (DirectTransferModel directory in directs)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, directory.model.Id.ToString());
            }

            foreach (GroupTransferModel group in groups)
            {
                if (group.model != null)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, group.model.Id.ToString());
                }
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, userId.Value);
            await Clients.Caller.SendAsync("GetChats", _serializator.SerializeWithCamelCase(new { directs, groups }));
        }

        public async Task ConnectToDirect(Guid id, string authorization)
        {
            var userId = _requestHandler.GetUserId(authorization);

            if (userId.IsFailure)
                return;

            DirectTransferModel? direct = await _messengerReposiroty
                .GetDirect(_fileService, id, Guid.Parse(userId.Value));

            if (direct == null)
                return;

            await Groups.AddToGroupAsync(Context.ConnectionId, direct.model.Id.ToString());
            await Clients.Caller.SendAsync("ReceiveMessage", _serializator.SerializeWithCamelCase(direct));
        }

        public record ConnectToGroupTM(Guid id, string authorization);

        public async Task ConnectToGroup(ConnectToGroupTM model)
        {
            var userId = _requestHandler.GetUserId(model.authorization);

            if (userId.IsFailure)
                return;

            GroupTransferModel? group = await _groupsRepository
                .GetGroup(model.id, Guid.Parse(userId.Value));

            if (group == null || group.model == null) 
                return;

            await Groups.AddToGroupAsync(Context.ConnectionId, group.model.Id.ToString());
            await Clients.Caller.SendAsync("ReceiveMessage", _serializator.SerializeWithCamelCase(group));
        }

        public async Task ChangeAccessState(Guid id, string authorization, bool isAccept)
        {
            var userId = _requestHandler.GetUserId(authorization);

            if (userId.IsFailure)
                return;

            Result<bool> state = await _messengerReposiroty
                .ChangeAcceptState(id, Guid.Parse(userId.Value), isAccept);

            if (state.IsFailure)
                return;

            await Clients.Group(id.ToString()).SendAsync("HandleAccessStateChange", _serializator.SerializeWithCamelCase(new { id, state = state.Value }));
        }
    }
}