using DocumentFormat.OpenXml.Wordprocessing;
using Exider.Repositories.Storage;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("[controller]")]
    public class FoldersController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly IFolderRepository _folderRepository;

        private readonly IHubContext<StorageHub> _storageHub;

        public FoldersController(IHubContext<StorageHub> storageHub, IFolderRepository folderRepository, IRequestHandler requestHandler)
        {
            _requestHandler = requestHandler;
            _folderRepository = folderRepository;
            _storageHub = storageHub;
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

            folderId = string.IsNullOrEmpty(folderId) ? userId.Value : folderId;

            await _storageHub.Clients.Group(folderId)
                .SendAsync("CreateFolder", result.Value);

            return Ok();
        }

        [HttpPut]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> UpdateName(Guid id, Guid folderId, string name)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("Invalid name");
            }

            await _folderRepository.UpdateName(id, name);

            await _storageHub.Clients.Group(folderId.ToString())
                .SendAsync("RenameFolder", new object[] { id, name });

            return Ok();
        }

        [HttpDelete]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Delete
        (
            IFileService fileService, 
            IFileRespository fileRespository,
            IFolderRepository folderRepository,
            Guid folderId,
            Guid id
        )
        {
            await fileService.DeleteFolderById
                (fileRespository, folderRepository, id);

            await _storageHub.Clients.Group(folderId.ToString())
                .SendAsync("DeleteFolder", id);

            return Ok();
        }
    }
}
