using Exider.Core;
using Exider.Core.Models.Storage;
using Exider.Repositories.Storage;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class PaginationController : ControllerBase
    {
        private readonly IFileRespository _fileRespository;

        private readonly IRequestHandler _requestHandler;

        private readonly Dictionary<string, string[]> Types = new Dictionary<string, string[]>
        {
            {"gallery", Configuration.imageTypes},
            {"music", Configuration.musicTypes}
        };

        public PaginationController(IFileRespository fileRespository, IRequestHandler requestHandler)
        {
            _fileRespository = fileRespository;
            _requestHandler = requestHandler;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/pagination")]
        public async Task<IActionResult> GetPhotos(IFileService fileService, int from, int count, string type)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            if (!Types.ContainsKey(type)) 
            {
                return BadRequest("Invalid type");
            }

            return Ok(await _fileRespository.GetLastFilesWithType(Guid.Parse(userId.Value), from, count, Types[type]));
        }
    }
}