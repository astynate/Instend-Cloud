using Instend.Core;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Repositories.Storage;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class PaginationController : ControllerBase
    {
        private readonly IFilesRespository _fileRespository;

        private readonly IRequestHandler _requestHandler;

        private readonly ISerializationHelper _serializationHelper;

        private readonly Dictionary<string, string[]> Types = new Dictionary<string, string[]>
        {
            { "gallery", Configuration.imageTypes.Concat(Configuration.videoTypes).ToArray() },
            { "music", Configuration.musicTypes }
        };

        public PaginationController(IFilesRespository fileRespository, IRequestHandler requestHandler, ISerializationHelper serializationHelper)
        {
            _fileRespository = fileRespository;
            _requestHandler = requestHandler;
            _serializationHelper = serializationHelper;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/pagination")]
        public async Task<IActionResult> GetPhotos(int skip, int take, string type)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            if (!Types.ContainsKey(type)) 
                return BadRequest("Invalid type");

            var result = await _fileRespository
                .GetLastFilesWithType(Guid.Parse(userId.Value), skip, take, Types[type]);

            return Ok(_serializationHelper.SerializeWithCamelCase(result));
        }
    }
}