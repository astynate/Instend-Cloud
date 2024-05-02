using Exider.Core.Models.Storage;
using Exider.Repositories.Gallery;
using Exider.Repositories.Storage;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private IFileRespository _fileRespository;

        private IRequestHandler _requestHandler;

        private IAlbumRepository _albumRepository;

        public GalleryController
        (
            IFileRespository fileRespository, 
            IRequestHandler requestHandler, 
            IAlbumRepository albumRepository
        )
        {
            _fileRespository = fileRespository;
            _requestHandler = requestHandler;
            _albumRepository = albumRepository;
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
        public async Task<IActionResult> GetAlbums(IImageService imageService)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            var result =  await _albumRepository.GetAlbums(imageService, Guid.Parse(userId.Value));

            if (result.IsFailure)
            {
                BadRequest(result.Error);
            }

            return Ok(result.Value);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAlbum([FromForm] IFormFile cover, [FromForm] string? name, [FromForm] string? description)
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

            var coverStream = new MemoryStream();

            await cover.CopyToAsync(coverStream);

            var result = await _albumRepository.AddAsync(Guid.Parse(userId.Value), coverStream.ToArray(), name, description);

            if (result.IsFailure)
            {
                return BadRequest(result.Error);
            }

            return Ok();
        }
    }
}