using Instend.Core.Models.Links;
using Instend.Repositories.Comments;
using Instend.Repositories.Gallery;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.SignalR;

namespace Instend_Version_2._0._0.Server.Hubs
{
    public class GalleryHub : Hub
    {
        private readonly IAlbumRepository _albumRepository;

        //private readonly IPublicationRepository<UserPublicationLink, Link> _publicationBaseRepository;

        private readonly IRequestHandler _requestHandler;

        public GalleryHub
        (
            IRequestHandler requestHandler,
            //IPublicationBaseRepository<UserPublicationLink> publicationBaseRepository,
            IAlbumRepository albumRepository
        )
        {
            //_publicationBaseRepository = publicationBaseRepository;
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

        //public async Task Connect(string authorization, string id)
        //{
        //    var userId = _requestHandler.GetUserId(authorization);

        //    if (userId.IsFailure) return;

        //    if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id)) return;

        //    var publications = await _publicationBaseRepository
        //        .([Guid.Parse(id)], DateTime.Now, 10, Guid.Parse(userId.Value));

        //    if (publications == null) return;

        //    await Groups.AddToGroupAsync(Context.ConnectionId, id);
        //    await Clients.Group(id).SendAsync("ReceivePublications", publications);
        //}
    }
}