using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;

        private readonly IAccessHandler _accessHandler;

        public FileController(IFileService fileService, IAccessHandler accessHandler)
        {
            _fileService = fileService;
            _accessHandler = accessHandler;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetFilePart(Guid id)
        {


            return Ok();
        }

        //private 
    }
}
