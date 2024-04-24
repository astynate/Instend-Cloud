using Exider.Core.Models.Storage;
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

        public GalleryController(IFileRespository fileRespository, IRequestHandler requestHandler)
        {
            _fileRespository = fileRespository;
            _requestHandler = requestHandler;
        }

        [HttpGet]
        public async Task<IActionResult> GetPhotos(IFileService fileService, int from, int count)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest();
            }

            FileModel[] files = await _fileRespository.GetLastPhotoByUserIdAsync(Guid.Parse(userId.Value), from, count);

            foreach (FileModel file in files)
            {
                await file.SetPreview(fileService);
            }

            return Ok(files);
        }
    }
}