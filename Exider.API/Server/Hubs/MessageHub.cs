using CSharpFunctionalExtensions;
using Exider.Core.Dependencies.Repositories.Messenger;
using Exider.Core.TransferModels;
using Exider.Repositories.Messenger;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace Exider_Version_2._0._0.Server.Hubs
{
    public class MessageHub : Hub
    {
        private readonly IRequestHandler _requestHandler;

        private readonly IMessengerReposiroty _messengerReposiroty;

        private readonly IDirectRepository _directRepository;

        private readonly IGroupsRepository _groupsRepository;

        private readonly IFileService _fileService;

        private readonly IChatBase[] _chatFactory = [];

        public MessageHub
        (
            IRequestHandler requestHandler, 
            IMessengerReposiroty messengerReposiroty, 
            IFileService fileService, 
            IDirectRepository directRepository,
            IGroupsRepository groupsRepository
        )
        {
            _requestHandler = requestHandler;
            _messengerReposiroty = messengerReposiroty;
            _fileService = fileService;
            _directRepository = directRepository;
            _chatFactory = [_directRepository];
            _groupsRepository = groupsRepository;
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
                await Groups.AddToGroupAsync(Context.ConnectionId, directory.directModel.Id.ToString());
            }

            foreach (GroupTransferModel group in groups)
            {
                if (group.groupModel != null)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, group.groupModel.Id.ToString());
                }
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, userId.Value);
            await Clients.Caller.SendAsync("GetChats", JsonConvert.SerializeObject(new { directs, groups }));
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

            await Groups.AddToGroupAsync(Context.ConnectionId, direct.directModel.Id.ToString());
            await Clients.Caller.SendAsync("ReceiveMessage", JsonConvert.SerializeObject(direct));
        }

        public record ConnectToGroupTM(Guid id, string authorization);

        public async Task ConnectToGroup(ConnectToGroupTM model)
        {
            var userId = _requestHandler.GetUserId(model.authorization);

            if (userId.IsFailure)
                return;

            GroupTransferModel? group = await _groupsRepository
                .GetGroup(model.id, Guid.Parse(userId.Value));

            if (group == null) 
                return;

            await Groups.AddToGroupAsync(Context.ConnectionId, group.groupModel.Id.ToString());
            await Clients.Caller.SendAsync("ReceiveMessage", JsonConvert.SerializeObject(group.groupModel));
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

            await Clients.Group(id.ToString()).SendAsync("HandleAccessStateChange", JsonConvert.SerializeObject(new { id, state = state.Value }));
        }
    }
}