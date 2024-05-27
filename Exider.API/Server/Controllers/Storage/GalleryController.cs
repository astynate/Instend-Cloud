using Exider.Core;
using Exider.Core.Models.Storage;
using Exider.Repositories.Gallery;
using Exider.Repositories.Storage;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Exider.Repositories.Account;
using Microsoft.AspNetCore.Authorization;
using Exider.Repositories.Links;
using static Exider.Core.Models.Links.AlbumLinks;
using Exider.Core.Models.Albums;
using Exider.Core.Models.Links;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private readonly IFileRespository _fileRespository;

        private readonly IFolderRepository _folderRespository;

        private readonly IRequestHandler _requestHandler;

        private readonly IUserDataRepository _userDataRepository;

        private readonly IAlbumRepository _albumRepository;

        private readonly ILinkBaseRepository<AlbumLink> _linkBaseRepository;

        private readonly IAccessHandler _accessHandler;

        private readonly IImageService _imageService;

        private readonly IHubContext<GalleryHub> _galleryHub;

        private readonly IHubContext<StorageHub> _storageHub;

        private DatabaseContext _context;

        public GalleryController
        (
            IFileRespository fileRespository, 
            IRequestHandler requestHandler, 
            IAlbumRepository albumRepository,
            IFolderRepository folderRepository,
            IHubContext<GalleryHub> galleryHub,
            IHubContext<StorageHub> storageHub,
            IUserDataRepository userDataRepository,
            ILinkBaseRepository<AlbumLink> linkBaseRepository,
            IAccessHandler accessHandler,
            IImageService imageService,
            DatabaseContext context
        )
        {
            _fileRespository = fileRespository;
            _requestHandler = requestHandler;
            _albumRepository = albumRepository;
            _folderRespository = folderRepository;
            _galleryHub = galleryHub;
            _context = context;
            _userDataRepository = userDataRepository;
            _accessHandler = accessHandler;
            _storageHub = storageHub;
            _linkBaseRepository = linkBaseRepository;
            _imageService = imageService;
        }

        private async Task<ActionResult<AlbumModel[]>> GetAlbums(IImageService imageService, Configuration.AlbumTypes type)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            var result = await _albumRepository.GetAlbums(imageService, Guid.Parse(userId.Value), type);

            if (result.IsFailure)
            {
                BadRequest(result.Error);
            }

            return Ok(result.Value);
        }

        [HttpGet]
        [Route("/api/albums")]
        [Authorize]
        public async Task<ActionResult<AlbumModel[]>> GetAlbumsWithDefaultType(IImageService imageService)
        {
            return await GetAlbums(imageService, Configuration.AlbumTypes.Album);
        }

        [HttpGet]
        [Route("/api/playlists")]
        [Authorize]
        public async Task<ActionResult<AlbumModel[]>> GetAlbumsWithPlaylistType(IImageService imageService)
        {
            return await GetAlbums(imageService, Configuration.AlbumTypes.Playlist);
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

            var result = await _albumRepository.DeleteAlbumAsync(Guid.Parse(id), Guid.Parse(userId.Value));

            if (result.IsFailure)
                return BadRequest(result.Error);

            await _galleryHub.Clients.Group(userId.Value.ToString()).SendAsync("DeleteAlbum", id);

            return Ok();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/gallery/upload")]
        public async Task<IActionResult> UploadToGallery
        (
            IFileService fileService,
            IHubContext<StorageHub> storageHub,
            [FromForm] IFormFile file,
            [FromForm] string? albumId,
            [FromForm] int queueId
        )
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            string[] nameSplit = file.FileName.Split(".");

            string name = nameSplit[0] ?? "Not set";
            string? type = nameSplit.Length >= 2 ? nameSplit[nameSplit.Length - 1] : null;

            if (type == null)
            {
                return BadRequest("Invalid type");
            }

            if (Configuration.imageTypes.Contains(type.ToLower()) == false)
            {
                return BadRequest("Invalid type");
            }

            try
            {
                return await _context.Database.CreateExecutionStrategy().ExecuteAsync<IActionResult>(async () =>
                {
                    using (var transaction = _context.Database.BeginTransaction())
                    {
                        var fileModel = await _fileRespository.AddPhotoAsync(name, type, file.Length, Guid.Parse(userId.Value));

                        if (fileModel.IsFailure)
                        {
                            return Conflict(fileModel.Error);
                        }

                        if (file.Length > 0 && fileModel.IsFailure == false)
                        {
                            using (var fileStream = new FileStream(fileModel.Value.Path, FileMode.Create))
                            {
                                await file.CopyToAsync(fileStream);
                            }

                            await fileModel.Value.SetPreview(fileService);
                        }

                        if (string.IsNullOrEmpty(albumId) == false && string.IsNullOrWhiteSpace(albumId) == false)
                        {
                            var result = await _linkBaseRepository.UploadFileToAlbum(fileModel.Value, Guid.Parse(albumId));

                            if (result.IsFailure)
                            {
                                return Conflict(result.Error);
                            }

                            await _galleryHub.Clients.Group(albumId).SendAsync("Upload", new object[] { fileModel.Value, albumId, queueId });
                        }
                        else
                        {
                            await storageHub.Clients.Group(fileModel.Value.OwnerId.ToString()).SendAsync("UploadFile", new object[] { fileModel.Value, queueId });
                        }

                        var user = await _userDataRepository.GetUserAsync(Guid.Parse(userId.Value));

                        if (user.IsFailure)
                        {
                            return BadRequest("User not found");
                        }

                        var space = await _userDataRepository.IncreaseOccupiedSpace(Guid.Parse(userId.Value), file.Length);

                        if (space.IsFailure)
                        {
                            return Conflict(space.Error);
                        }

                        await _storageHub.Clients.Group(fileModel.Value.OwnerId.ToString())
                            .SendAsync("UpdateOccupiedSpace", space.Value.OccupiedSpace);

                        transaction.Commit();
                        return Ok();
                    }
                });
            }
            catch (Exception exception)
            {
                await Console.Out.WriteLineAsync(exception.Message);
                return Conflict("Something went wrong while trying to save image");
            }
        }

        [HttpPost]
        [Authorize]
        [Route("/api/albums")]
        public async Task<IActionResult> AddToAlbum(string fileId, string albumId)
        {
            if (string.IsNullOrEmpty(fileId) || string.IsNullOrWhiteSpace(fileId))
            {
                return BadRequest("Invalid file id");
            }

            if (string.IsNullOrEmpty(albumId) || string.IsNullOrWhiteSpace(albumId))
            {
                return BadRequest("Invalid album id");
            }

            var result = await _linkBaseRepository.AddFileToAlbum(Guid.Parse(fileId), Guid.Parse(albumId));

            if (result.IsFailure)
            {
                return Conflict(result.Error);
            }

            await _galleryHub.Clients.Group(albumId).SendAsync("AddToAlbum", new object[] { result.Value, albumId });

            return Ok();
        }

        [HttpGet]
        [Authorize]
        [Route("/api/album")]
        public async Task<IActionResult> GetAlbum(ILinkBaseRepository<AlbumViewLink> linkRepository, IFileService fileService, string id, int from, int count)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Invalid album id");
            }

            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            var views = await _albumRepository.ViewAlbumWithUserId(Guid.Parse(id), Guid.Parse(userId.Value));

            if (views.IsFailure)
            {
                return BadRequest(views.Error);
            }

            if (views.Value != -1)
            {
                await _galleryHub.Clients.Group(id).SendAsync("UpdateAlbumViews", new object[] { id, views.Value });
            }

            FileModel[] files = await _fileRespository.GetLastPhotoFromAlbum(Guid.Parse(userId.Value), Guid.Parse(id), from, count);

            foreach (FileModel file in files)
            {
                await file.SetPreview(fileService);
            }

            return Ok(files);
        }

        private async Task<IActionResult> CreateAlbumWithType(IImageService imageService, IFormFile? cover, string? name, string? description, int queueId, Configuration.AlbumTypes type)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("Name is required.");
            }

            byte[] coverAsBytes = [];

            using (var coverStream = new MemoryStream())
            {
                if (cover != null && cover.Length > 0)
                {
                    await cover.CopyToAsync(coverStream);
                    coverAsBytes = coverStream.ToArray();
                }
            }

            var result = await _albumRepository.AddAsync(Guid.Parse(userId.Value), coverAsBytes, name, description, type);

            if (result.IsFailure)
            {
                return BadRequest(result.Error);
            }

            await result.Value.SetCover(imageService);
            await _galleryHub.Clients.Group(result.Value.OwnerId.ToString()).SendAsync("Create", new object[] { result.Value, queueId });

            return Ok();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/albums/create")]
        public async Task<IActionResult> CreateAlbumWithDefaultType
        (
            [FromForm] IFormFile? cover,
            [FromForm] string? name,
            [FromForm] string? description,
            [FromForm] int queueid
        )
        {
            return await CreateAlbumWithType(_imageService, cover, name, description, queueid, Configuration.AlbumTypes.Album);
        }

        [HttpPost]
        [Authorize]
        [Route("/api/playlists/create")]
        public async Task<IActionResult> CreateAlbumWithPlaylistType
        (
            [FromForm] IFormFile? cover,
            [FromForm] string? name,
            [FromForm] string? description,
            [FromForm] int queueId
        )
        {
            return await CreateAlbumWithType(_imageService, cover, name, description, queueId, Configuration.AlbumTypes.Playlist);
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
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Album not found");

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Name is required");

            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            byte[] coverAsBytes = [];

            using (var coverStream = new MemoryStream())
            {
                if (cover != null && cover.Length > 0)
                {
                    await cover.CopyToAsync(coverStream);
                    coverAsBytes = coverStream.ToArray();
                }
            }

            var result = await _albumRepository.UpdateAlbum(Guid.Parse(id), coverAsBytes, name, description);

            if (result.IsFailure)
            {
                return Conflict(result.Error);
            }

            await _galleryHub.Clients.Group(id.ToString()).SendAsync("Update", new { id, coverAsBytes, name, description });
            return Ok();
        }
    }
}