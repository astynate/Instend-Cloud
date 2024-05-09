using Exider.Core;
using Exider.Core.Models.Gallery;
using Exider.Core.Models.Storage;
using Exider.Repositories.Gallery;
using Exider.Repositories.Storage;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private IFileRespository _fileRespository;

        private IFolderRepository _folderRespository;

        private IRequestHandler _requestHandler;

        private IAlbumRepository _albumRepository;

        private readonly IHubContext<GalleryHub> _galleryHub;

        private DatabaseContext _context;

        public GalleryController
        (
            IFileRespository fileRespository, 
            IRequestHandler requestHandler, 
            IAlbumRepository albumRepository,
            IFolderRepository folderRepository,
            IHubContext<GalleryHub> galleryHub,
            DatabaseContext context
        )
        {
            _fileRespository = fileRespository;
            _requestHandler = requestHandler;
            _albumRepository = albumRepository;
            _folderRespository = folderRepository;
            _galleryHub = galleryHub;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPhotos(IFileService fileService, int from, int count)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            FileModel[] files = await _fileRespository.GetLastPhotoByUserIdAsync(Guid.Parse(userId.Value), from, count);

            foreach (FileModel file in files)
            {
                await file.SetPreview(fileService);
            }

            return Ok(files);
        }

        [HttpGet]
        [Route("/api/albums")]
        public async Task<ActionResult<AlbumModel[]>> GetAlbums(IImageService imageService)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            var result = await _albumRepository.GetAlbums(imageService, Guid.Parse(userId.Value));

            if (result.IsFailure)
            {
                BadRequest(result.Error);
            }

            return Ok(result.Value);
        }

        [HttpDelete]
        [Route("/api/albums")]
        public async Task<IActionResult> GeDeleteAlbum(string id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Invalid id");
            }

            var result = await _albumRepository.DeleteAlbumAsync(Guid.Parse(id), Guid.Parse(userId.Value));

            if (result.IsFailure)
            {
                BadRequest(result.Error);
            }

            return Ok();
        }

        [HttpPost]
        [Route("/api/gallery/upload")]
        public async Task<IActionResult> UploadToGallery
        (
            IAlbumRepository albumRepository, 
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
                        var fileModel = await _fileRespository.AddPhotoAsync(name, type, Guid.Parse(userId.Value));

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
                            var result = await albumRepository.AddPhotoToAlbum(fileModel.Value.Id, Guid.Parse(albumId));

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

            var result = await _albumRepository.AddPhotoToAlbum(Guid.Parse(fileId), Guid.Parse(albumId));

            if (result.IsFailure)
            {
                return Conflict(result.Error);
            }

            await _galleryHub.Clients.Group(albumId).SendAsync("Upload", new object[] { result.Value, albumId });
            return Ok();
        }

        [HttpGet]
        [Route("/api/album")]
        public async Task<IActionResult> GetAlbum(IFileService fileService, string id, int from, int count)
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

            FileModel[] files = await _fileRespository.GetLastPhotoFromAlbum(Guid.Parse(userId.Value), Guid.Parse(id), from, count);

            foreach (FileModel file in files)
            {
                await file.SetPreview(fileService);
            }

            return Ok(files);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAlbum(IImageService imageService, [FromForm] IFormFile? cover, [FromForm] string? name, [FromForm] string? description)
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

            var result = await _albumRepository.AddAsync(Guid.Parse(userId.Value), coverAsBytes, name, description);

            if (result.IsFailure)
            {
                return BadRequest(result.Error);
            }

            await result.Value.SetCover(imageService);
            await _galleryHub.Clients.Group(result.Value.OwnerId.ToString()).SendAsync("Create", result.Value);

            return Ok();
        }
    }
}