using Exider.Core.Models.Gallery;
using Exider.Core.Models.Storage;
using Exider.Repositories.Gallery;
using Exider.Repositories.Storage;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.SignalR;

namespace Exider_Version_2._0._0.Server.Hubs
{
    public class GalleryHub : Hub
    {
        private readonly IAlbumRepository _albumRepository;

        private readonly IRequestHandler _requestHandler;

        private readonly IImageService _imageService;

        public GalleryHub(IImageService imageService, IRequestHandler requestHandler, IAlbumRepository albumRepository)
        {
            _albumRepository = albumRepository;
            _requestHandler = requestHandler;
            _imageService = imageService;
        }

        public async Task Join(string authorization)
        {
            var userId = _requestHandler.GetUserId(authorization);

            if (userId.IsFailure) return;

            var albums = await _albumRepository.GetAlbums(_imageService, Guid.Parse(userId.Value));

            if (albums.IsFailure)
            {
                return;
            }

            Array.ForEach(albums.Value, async x => await Groups
                .AddToGroupAsync(Context.ConnectionId, x.Id.ToString()));

            await Groups.AddToGroupAsync(Context.ConnectionId, userId.Value);
        }
    }
}