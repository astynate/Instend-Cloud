using Exider.Repositories.Storage;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("[controller]")]
    public class FoldersController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly IFolderRepository _folderRepository;

        public FoldersController(IFolderRepository folderRepository, IRequestHandler requestHandler)
        {
            _requestHandler = requestHandler;
            _folderRepository = folderRepository;
        }

        [HttpPost]
        public async Task<ActionResult> CreateFolder([FromForm] string? folderId, [FromForm] string name)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest("Invalid user id");
            }

            Guid folder = Guid.Empty;

            if (string.IsNullOrEmpty(folderId) == false && string.IsNullOrWhiteSpace(folderId) == false)
            {
                folder = Guid.Parse(folderId);
            }

            var result = await _folderRepository.AddAsync(name, Guid.Parse(userId.Value), folder);

            if (result.IsFailure)
            {
                return BadRequest("Failed to create folder");
            }

            return Ok();
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateName(Guid id, string name)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("Invalid name");
            }

            await _folderRepository.UpdateName(id, name);
            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete
        (
            IFileService fileService, 
            IFileRespository fileRespository,
            IFolderRepository folderRepository,
            Guid id
        )
        {
            await fileService.DeleteFolderById
                (fileRespository, folderRepository, id);

            return Ok();
        }
    }
}
