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

        public MusicController(IFileRespository fileRespository, IRequestHandler requestHandler)
        {
            _fileRespository = fileRespository;
            _requestHandler = requestHandler;
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
    }
}