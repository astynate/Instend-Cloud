using Instend.Repositories.Gallery;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.SignalR;

namespace Instend_Version_2._0._0.Server.Hubs
{
    public class GalleryHub : Hub
    {
        private readonly IAlbumRepository _albumRepository;

        //private readonly IPublicationRepository<UserP, Link> _publicationBaseRepository;

        private readonly IRequestHandler _requestHandler;

        public GalleryHub
        (
            IRequestHandler requestHandler,
            //IPublicationBaseRepository<UserPublicationLink> publicationBaseRepository,
            IAlbumRepository albumRepository
        )
        {
            _albumRepository = albumRepository;
            _requestHandler = requestHandler;
        }

        public async Task Join(string authorization)
        {
            var userId = _requestHandler.GetUserId(authorization);

            if (userId.IsFailure) return;

            var albums = await _albumRepository.GetAlbums(Guid.Parse(userId.Value));

            Array.ForEach(albums, async x => await Groups
                .AddToGroupAsync(Context.ConnectionId, x.Id.ToString()));

            await Groups.AddToGroupAsync(Context.ConnectionId, userId.Value);
        }
    }
}