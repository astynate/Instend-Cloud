using CSharpFunctionalExtensions;
using Exider.Core.Models.Formats;
using Exider.Core.Models.Storage;
using Exider.Repositories.Storage;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("api/[controller]")]
    public class MusicController : ControllerBase
    {
        private readonly IFileRespository _fileRespository;

        private readonly IRequestHandler _requestHandler;

        private readonly IFormatRepository<SongFormat> _songFormat;

        public MusicController
        (
            IFileRespository fileRespository, 
            IRequestHandler requestHandler,
            IFormatRepository<SongFormat> songFormat
        )
        {
            _fileRespository = fileRespository;
            _requestHandler = requestHandler;
            _songFormat = songFormat;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> BroadcastSong(string id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id)) 
            {
                return BadRequest("File not found");
            }

            var fileModel = await _fileRespository.GetByIdAsync(Guid.Parse(id));

            if (fileModel.IsFailure)
            {
                return Conflict(fileModel.Error);
            }

            var memory = new MemoryStream();

            using (var stream = new FileStream(fileModel.Value.Path, FileMode.Open))
            {
                stream.CopyTo(memory);
            }

            memory.Position = 0;
            
            return File(memory, "audio/mpeg", fileModel.Value.Name);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UpdateSongMeta
        (
            [FromForm] IFormFile file,
            [FromForm] Guid id,
            [FromForm] string? title,
            [FromForm] string? artist,
            [FromForm] string? album
        )
        {
            Result<(FileModel?, SongFormat?)> result = await _songFormat.GetByIdWithMetaData(id);

            if (result.IsFailure)
            {
                return Conflict("Not found");
            }

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                
                result.Value.Item2.UpdateData(memoryStream.ToArray(), title, artist, album, result.Value.Item1.Type, result.Value.Item1.Path);

                await _songFormat.SaveChanges(result.Value.Item2);
            }

            return Ok(result);
        }
    }
}