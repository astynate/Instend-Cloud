using Exider.Core.Models.Storage;
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

        private readonly IAccessHandler _accessHandler;

        private readonly IHubContext<StorageHub> _storageHub;

        public FoldersController
        (
            IHubContext<StorageHub> storageHub, 
            IFolderRepository folderRepository, 
            IRequestHandler requestHandler,
            IAccessHandler accessHandler
        )
        {
            _requestHandler = requestHandler;
            _folderRepository = folderRepository;
            _storageHub = storageHub;
            _accessHandler = accessHandler;
        }

        [HttpGet]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult> Download(string? id, IFileRespository fileRespository, IFileService fileService)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest("Invalid user id");
            }

            FileModel[] files = await fileRespository.GetByFolderId(Guid.Parse(userId.Value), 
                id == null ? Guid.Empty : Guid.Parse(id));

            FolderModel? folder = null;

            if (id != null)
            {
                folder = await _folderRepository.GetByIdAsync(Guid.Parse(id));
            }

            if (folder != null)
            {
                bool isAvailable = await _accessHandler.GetAccessStateAsync(folder, Request.Headers["Authorization"]);

                if (isAvailable == false) 
                {
                    return BadRequest("Access denied");
                }
            }

            string zipName = folder == null ? "Yexider Cloud.zip" : folder.Name + ".zip";

            byte[] zipArchive = fileService.CreateZipFromFiles(files);
            
            return File(zipArchive, System.Net.Mime.MediaTypeNames.Application.Zip, zipName);
        }

        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize]
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

            if (folder != Guid.Empty)
            {
                FolderModel? folderModel = await _folderRepository.GetByIdAsync(folder);

                if (folderModel == null)
                {
                    return BadRequest("Folder not found");
                }

                bool isAvailable = await _accessHandler.GetAccessStateAsync(folderModel, Request.Headers["Authorization"]);

                if (isAvailable == false)
                {
                    return BadRequest("Access denied");
                }
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

            if (id != Guid.Empty)
            {
                FolderModel? folderModel = await _folderRepository.GetByIdAsync(id);

                if (folderModel == null)
                {
                    return BadRequest("Folder not found");
                }

                bool isAvailable = await _accessHandler.GetAccessStateAsync(folderModel, Request.Headers["Authorization"]);

                if (isAvailable == false)
                {
                    return BadRequest("Access denied");
                }
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
            if (id != Guid.Empty)
            {
                FolderModel? folderModel = await _folderRepository.GetByIdAsync(id);

                if (folderModel == null)
                {
                    return BadRequest("Folder not found");
                }

                bool isAvailable = await _accessHandler.GetAccessStateAsync(folderModel, Request.Headers["Authorization"]);

                if (isAvailable == false)
                {
                    return BadRequest("Access denied");
                }
            }

            await fileService.DeleteFolderById
                (fileRespository, folderRepository, id);

            await _storageHub.Clients.Group(folderId.ToString())
                .SendAsync("DeleteFolder", id);

            return Ok();
        }
    }
}