using Exider.Core.Models.Links;
using Exider.Repositories.Comments;
using Exider.Repositories.Gallery;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.SignalR;
using static Exider.Core.Models.Links.AlbumLinks;

namespace Exider_Version_2._0._0.Server.Hubs
{
    public class GalleryHub : Hub
    {
        private readonly IAlbumRepository _albumRepository;

        private readonly IRequestHandler _requestHandler;

        private readonly ICommentsRepository<ComminityPublicationLink, AttachmentCommentLink> _publicationRepository;

        public GalleryHub
        (
            IRequestHandler requestHandler, 
            IAlbumRepository albumRepository, 
            ICommentsRepository<ComminityPublicationLink, AttachmentCommentLink> publicationRepository
        )
        {
            _albumRepository = albumRepository;
            _requestHandler = requestHandler;
            _publicationRepository = publicationRepository;
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

        public async Task Connect(string authorization, string id)
        {
            var userId = _requestHandler.GetUserId(authorization);

            if (userId.IsFailure) return;

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id)) return;

            var publications = await _publicationRepository.GetLastCommentsAsync([Guid.Parse(id)], DateTime.Now, 10, Guid.Parse(userId.Value));

            if (publications == null) return;

            await Groups.AddToGroupAsync(Context.ConnectionId, id);
            await Clients.Group(id).SendAsync("ReceivePublications", publications);
        }
    }
}