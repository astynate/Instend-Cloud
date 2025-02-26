﻿using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Core.Models.Abstraction;
using Instend.Repositories.Gallery;
using Instend.Repositories.Messenger;
using Instend.Repositories.Storage;
using Instend.Server.Hubs;
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

        private readonly JoinHubHelper _joinHubHelper;

        private delegate Task<List<T>> GetEntitiesDelegate<T>(Guid id) where T : DatabaseModel;

        public GlobalHub
        (
            IRequestHandler requestHandler, 
            IDirectRepository directRepository,
            ICollectionsRepository collectionsRepository,
            IGroupsRepository groupsRepository,
            ISerializationHelper serializator,
            IAlbumsRepository albumsRepository
        )
        {
            _requestHandler = requestHandler;
            _directRepository = directRepository;
            _collectionsRepository = collectionsRepository;
            _groupsRepository = groupsRepository;
            _serializator = serializator;
            _albumsRepository = albumsRepository;
            _joinHubHelper = new JoinHubHelper(this, _serializator);
        }

        private bool IsValidUserData(string authorization, out Guid userId)
        {
            var userIdResult = _requestHandler.GetUserId(authorization);
            
            userId = Guid.Empty;

            if (userIdResult.IsFailure)
                return false;

            return Guid.TryParse(userIdResult.Value, out userId);
        }

        private async Task JoinToEntity<T>(GetEntitiesDelegate<T> callback, string handler, string authorization) where T : DatabaseModel
        {
            var userId = Guid.Empty;

            if (IsValidUserData(authorization, out userId) == false)
                return;

            IEnumerable<DatabaseModel> entities = await callback(userId);
            IEnumerable<string> groups = [..entities.Select(x => x.Id.ToString()), userId.ToString()];

            await _joinHubHelper.Join(handler, Context.ConnectionId, groups, entities);
        }

        public async Task JoinToDirects(string authorization)
            => await JoinToEntity(_directRepository.GetAccountDirectsAsync, "JoinToDirectsHandler", authorization);

        public async Task JoinToGroups(string authorization)
            => await JoinToEntity(_groupsRepository.GetAccountGroups, "JoinToGroupsHandler", authorization);

        public async Task JoinToAlbums(string authorization)
            => await JoinToEntity(_albumsRepository.GetAllAccountAlbums, "JoinToAlbumsHandler", authorization);

        public async Task JoinToCollections(string authorization)
            => await JoinToEntity(_collectionsRepository.GetCollectionsByAccountId, "JoinToCollectionsHandler", authorization);

        public async Task ConnectToDirect(Guid id)
        {
            var currentTime = DateTime.Now;
            var delayedTime = currentTime.AddSeconds(5);
            var direct = await _directRepository.GetAsync(id, delayedTime, 1);

            if (direct == null)
                return;

            await Groups.AddToGroupAsync(Context.ConnectionId, direct.Id.ToString());
            await Clients.Caller.SendAsync("ReceiveMessage", _serializator.SerializeWithCamelCase(new { transferModel = direct }));
        }

        public async Task ConnectToGroup(Guid id, string authorization)
        {
            var userId = _requestHandler.GetUserId(authorization);

            if (userId.IsFailure)
                return;

            var group = await _groupsRepository
                .GetByIdAsync(id, Guid.Parse(userId.Value), DateTime.Now, 1);

            if (group == null) 
                return;

            await Groups.AddToGroupAsync(Context.ConnectionId, group.Id.ToString());
            await Clients.Caller.SendAsync("ReceiveMessage", _serializator.SerializeWithCamelCase(group));
        }
    }
}