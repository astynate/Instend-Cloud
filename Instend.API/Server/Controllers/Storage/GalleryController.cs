using Instend.Core;
using Instend.Repositories.Gallery;
using Instend.Repositories.Storage;
using Instend.Services.External.FileService;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.Hubs;
using Instend.Core.Dependencies.Repositories.Account;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Storage.Album;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;

namespace Instend_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private readonly IFilesRespository _filesRespository;

        private readonly ICollectionsRepository _folderRespository;

        private readonly IRequestHandler _requestHandler;

        private readonly IAccountsRepository _accountsRepository;

        private readonly IAlbumsRepository _albumsRepository;

        private readonly IAccessHandler _accessHandler;

        private readonly IImageService _imageService;

        private readonly ISerializationHelper _serializationHelper;

        private readonly IHubContext<GlobalHub> _globalHub;

        private GlobalContext _context;

        private FilesController _filesController;

        public GalleryController
        (
            IFilesRespository fileRespository, 
            IRequestHandler requestHandler, 
            IAlbumsRepository albumRepository,
            ICollectionsRepository folderRepository,
            IHubContext<GlobalHub> globalHub,
            IAccountsRepository accountsRepository,
            IAccessHandler accessHandler,
            IImageService imageService,
            ISerializationHelper serializationHelper,
            GlobalContext context,
            FilesController filesController
        )
        {
            _filesRespository = fileRespository;
            _requestHandler = requestHandler;
            _albumsRepository = albumRepository;
            _folderRespository = folderRepository;
            _globalHub = globalHub;
            _context = context;
            _accountsRepository = accountsRepository;
            _accessHandler = accessHandler;
            _imageService = imageService;
            _serializationHelper = serializationHelper;
            _filesController = filesController;
        }

        public class CreateAlbumTransferObject
        {
            public IFormFile? cover { get; init; }
            public string? name { get; init; }
            public string? description { get; init; }
            public int queueid { get; init; }
        }

        [HttpGet]
        [Route("/api/albums")]
        [Authorize]
        public async Task<ActionResult<Album[]>> GetAlbums(int skip, int take) 
            => await GetAlbums(Configuration.AlbumTypes.Album, skip, take);

        [HttpGet]
        [Route("/api/playlists")]
        [Authorize]
        public async Task<ActionResult<Album[]>> GetPlaylists(int skip, int take) 
            => await GetAlbums(Configuration.AlbumTypes.Playlist, skip, take);

        private (string name, string? type) GetFileData(IFormFile file)
        {
            var nameSplit = file.FileName.Split(".");
            var name = nameSplit[0] ?? "Unknown";
            var type = nameSplit.Length >= 2 ? nameSplit[nameSplit.Length - 1] : null;

            return (name, type);
        }

        [HttpGet]
        [Authorize]
        [Route("/api/album")]
        public async Task<IActionResult> GetAlbum(Guid id, int skip, int take)
        {
            var userId = _requestHandler
                .GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var result = await _albumsRepository
                .GetByIdAsync(id, skip, take);

            return Ok(_serializationHelper.SerializeWithCamelCase(result));
        }

        [HttpPost]
        [Authorize]
        [Route("/api/albums/create")]
        public async Task<IActionResult> CreateAlbumWithDefaultType([FromForm] CreateAlbumTransferObject createTO)
            => await CreateAlbumWithType(createTO, Configuration.AlbumTypes.Album);

        [HttpPost]
        [Authorize]
        [Route("/api/playlists/create")]
        public async Task<IActionResult> CreateAlbumWithPlaylistType([FromForm] CreateAlbumTransferObject createTO)
            => await CreateAlbumWithType(createTO, Configuration.AlbumTypes.Playlist);

        private async Task<ActionResult<Album[]>> GetAlbums(Configuration.AlbumTypes type, int skip, int take)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var result = await _albumsRepository
                .GetAlbums(Guid.Parse(userId.Value), type, skip, take);

            return Ok(_serializationHelper.SerializeWithCamelCase(result));
        }

        private async Task<IActionResult> CreateAlbumWithType(CreateAlbumTransferObject createTO, Configuration.AlbumTypes type)
        {
            var accountId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (accountId.IsFailure)
                return BadRequest(accountId.Error);

            if (string.IsNullOrEmpty(createTO.name) || string.IsNullOrWhiteSpace(createTO.name))
                return BadRequest("Name is required.");

            var fileData = createTO.cover != null ? GetFileData(createTO.cover) : ("", "");
            var coverAsBytes = new byte[0];

            using (var coverStream = new MemoryStream())
            {
                if (createTO.cover != null && createTO.cover.Length > 0)
                {
                    await createTO.cover.CopyToAsync(coverStream);
                    coverAsBytes = coverStream.ToArray();
                }
            }

            var result = await _albumsRepository.AddAsync
            (
                Guid.Parse(accountId.Value),
                coverAsBytes,
                createTO.name,
                fileData.Item2,
                createTO.description,
                type
            );

            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(_serializationHelper.SerializeWithCamelCase(new object[] { result.Value, createTO.queueid }));
        }

        [HttpPost]
        [Authorize]
        [Route("/api/albums/upload/existing")]
        public async Task<IActionResult> AddInAlbumAsync([FromForm] Guid id, [FromForm] Guid[] files)
        {
            var album = await _albumsRepository.GetByIdAsync(id, 0, int.MaxValue);
            var items = await _filesRespository.GetFilesByIdsAsync(files);

            string[] galleryTypes = [..Configuration.imageTypes, ..Configuration.videoTypes];

            if (album == null)
                return BadRequest("Album not found");

            switch(album.Type)
            {
                case (Configuration.AlbumTypes.Album):
                {
                    items = items
                        .Where(x => galleryTypes.Contains(x.Type))
                        .ToList();

                    break;
                }
                case (Configuration.AlbumTypes.Playlist):
                {
                    items = items
                        .Where(x => Configuration.musicTypes.Contains(x.Type))
                        .ToList();

                    break;
                }
            }

            var albumFiles = album.Files.Select(x => x.Id);

            items = items
                .Where(x => albumFiles.Contains(x.Id) == false)
                .ToList();

            if (items.Count() > 0)
                await _albumsRepository.UploadFilesInAlbum(id, items.ToArray());

            await _globalHub.Clients
                .Group(id.ToString())
                .SendAsync("UploadInAlbum", _serializationHelper.SerializeWithCamelCase(new { id, items }));

            return Ok();
        }

        [HttpPut]
        [Authorize]
        [Route("/api/albums/remove")]
        public async Task<IActionResult> RemoveFileFromAlbum(Guid id, Guid file)
        {
            await _albumsRepository.RemoveFileFromAlbum(id, file);

            await _globalHub.Clients
                .Group(id.ToString())
                .SendAsync("RemoveFromAlbum", _serializationHelper.SerializeWithCamelCase(new { id, file }));

            return Ok();
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> EditAlbum
        (
            IImageService imageService,
            [FromForm] IFormFile? cover,
            [FromForm] string? name,
            [FromForm] string? description,
            [FromForm] string? id
        )
        {
            throw new NotImplementedException();

            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Album not found");

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Name is required");

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var coverAsBytes = new byte[0];

            using (var coverStream = new MemoryStream())
            {
                if (cover != null && cover.Length > 0)
                {
                    await cover.CopyToAsync(coverStream);
                    coverAsBytes = coverStream.ToArray();
                }
            }

            var result = await _albumsRepository
                .UpdateAlbum(Guid.Parse(id), coverAsBytes, name, description);

            if (result.IsFailure)
                return Conflict(result.Error);

            await _globalHub.Clients.Group(id.ToString())
                .SendAsync("Update", new { id, coverAsBytes, name, description });

            return Ok();
        }

        [Authorize]
        [HttpDelete]
        [Route("/api/albums")]
        public async Task<IActionResult> DeleteAlbum(string id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Invalid id");

            var result = await _albumsRepository
                .DeleteAlbumAsync(Guid.Parse(id), Guid.Parse(userId.Value));

            if (result.IsFailure)
                return BadRequest(result.Error);

            await _globalHub.Clients
                .Group(userId.Value.ToString())
                .SendAsync("DeleteAlbum", id);

            return Ok();
        }
    }
}