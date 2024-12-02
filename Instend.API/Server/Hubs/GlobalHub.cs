using Instend.Core.Dependencies.Repositories.Messenger;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Core.Models.Messenger.Direct;
using Instend.Core.Models.Messenger.Group;
using Instend.Core.Models.Storage.Collection;
using Instend.Repositories.Gallery;
using Instend.Repositories.Messenger;
using Instend.Repositories.Storage;
using Instend.Server.Hubs;
using Instend.Services.External.FileService;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.SignalR;

namespace Instend_Version_2._0._0.Server.Hubs
{
    public class GlobalHub : Hub
    {
        private readonly IRequestHandler _requestHandler;

        private readonly ICollectionsRepository _collectionsRepository;

        private readonly IAlbumsRepository _albumsRepository;

        private readonly IDirectRepository _directRepository;

        private readonly IGroupsRepository _groupsRepository;

        private readonly ISerializationHelper _serializator;

        private readonly IFileService _fileService;

        private readonly JoinHubHelper _joinHubHelper;

        public GlobalHub
        (
            IRequestHandler requestHandler, 
            IFileService fileService, 
            IDirectRepository directRepository,
            ICollectionsRepository collectionsRepository,
            IGroupsRepository groupsRepository,
            ISerializationHelper serializator,
            IAlbumsRepository albumsRepository,
            JoinHubHelper joinHubHelper
        )
        {
            _requestHandler = requestHandler;
            _fileService = fileService;
            _directRepository = directRepository;
            _collectionsRepository = collectionsRepository;
            _groupsRepository = groupsRepository;
            _serializator = serializator;
            _albumsRepository = albumsRepository;
            _joinHubHelper = joinHubHelper;
        }

        private bool IsValidUserData(string authorization, out Guid userId)
        {
            var userIdResult = _requestHandler.GetUserId(authorization);
            
            userId = Guid.Empty;

            if (userIdResult.IsFailure)
                return false;

            return Guid.TryParse(userIdResult.Value, out userId);
        }

        public async Task JoinToAccountDirects(string authorization, int skip, int take)
        {
            var userId = Guid.Empty;

            if (IsValidUserData(authorization, out userId) == false)
                return;

            IEnumerable<Direct> directs = await _directRepository.GetAccountDirectsAsync(userId, 0, 1);
            IEnumerable<string> groupNames = [..directs.Select(x => x.Id.ToString()), Context.ConnectionId];

            await _joinHubHelper.Join("JoinDirectsHandler", Context.ConnectionId, groupNames, directs);
        }

        public async Task JoinToAccountGroups(string authorization, int skip, int take)
        {
            var userId = Guid.Empty;

            if (IsValidUserData(authorization, out userId) == false)
                return;

            IEnumerable<Group> groups = await _groupsRepository.GetAccountGroups(userId);
            IEnumerable<string> groupNames = [.. groups.Select(x => x.Id.ToString()), Context.ConnectionId];

            await _joinHubHelper.Join("JoinGroupsHandler", Context.ConnectionId, groupNames, groups);
        }

        public async Task ConnectToDirect(Guid id, string authorization)
        {
            var userId = Guid.Empty;

            if (IsValidUserData(authorization, out userId) == false)
                return;

            var direct = await _directRepository.GetAsync(id, userId, 0, 1);

            if (direct == null)
                return;

            await Groups.AddToGroupAsync(Context.ConnectionId, direct.Id.ToString());
            await Clients.Caller.SendAsync("ReceiveMessage", _serializator.SerializeWithCamelCase(direct));
        }

        public async Task ConnectToGroup(Guid id, string authorization)
        {
            var userId = _requestHandler.GetUserId(authorization);

            if (userId.IsFailure)
                return;

            var group = await _groupsRepository
                .GetByIdAsync(id, Guid.Parse(userId.Value), 0, 1);

            if (group == null) 
                return;

            await Groups.AddToGroupAsync(Context.ConnectionId, group.Id.ToString());
            await Clients.Caller.SendAsync("ReceiveMessage", _serializator.SerializeWithCamelCase(group));
        }

        public async Task JoinToAccountAlbums(string authorization)
        {
            var userId = _requestHandler.GetUserId(authorization);

            if (userId.IsFailure)
                return;

            var albums = await _albumsRepository.GetAllAccountAlbums(Guid.Parse(userId.Value));

            Array.ForEach(albums, async x => await Groups
                .AddToGroupAsync(Context.ConnectionId, x.Id.ToString()));

            await Groups.AddToGroupAsync(Context.ConnectionId, userId.Value);
        }

        public async Task JoinToAccountCollections(string authorization)
        {
            var userId = _requestHandler.GetUserId(authorization);

            if (userId.IsFailure)
                return;

            var collections = await _collectionsRepository
                .GetCollectionsByAccountId(Guid.Parse(userId.Value));

            Array.ForEach(collections, async x => await Groups
                .AddToGroupAsync(Context.ConnectionId, x.Id.ToString()));

            await Groups.AddToGroupAsync(Context.ConnectionId, userId.Value);
        }

        public async Task CreateFolder(Collection folder)
            => await Clients.Group(folder.Id.ToString()).SendAsync("CreateFolder", folder);
    }
}