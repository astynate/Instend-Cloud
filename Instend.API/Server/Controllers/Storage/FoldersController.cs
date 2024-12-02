using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Models.Storage.Collection;
using Instend.Repositories.Storage;
using Instend.Services.External.FileService;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Instend_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("[controller]")]
    public class FoldersController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly ICollectionsRepository _folderRepository;

        private readonly IAccountsRepository _accountsRepository;

        private readonly IAccessHandler _accessHandler;

        private readonly IFileService _fileService;

        private readonly IFileRespository _fileRespository;

        private readonly IPreviewService _previewService;

        private readonly IHubContext<StorageHub> _storageHub;

        public FoldersController
        (
            IHubContext<StorageHub> storageHub, 
            ICollectionsRepository folderRepository,
            IAccountsRepository accountsRepository,
            IFileService fileService,
            IFileRespository fileRespository,
            IRequestHandler requestHandler,
            IPreviewService previewService,
            IAccessHandler accessHandler
        )
        {
            _storageHub = storageHub;
            _accessHandler = accessHandler;
            _requestHandler = requestHandler;
            _folderRepository = folderRepository;
            _fileRespository = fileRespository;
            _fileService = fileService;
            _previewService = previewService;
            _accountsRepository = accountsRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> Download(Guid id, IFileRespository fileRespository, IFileService fileService)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            var files = await fileRespository.GetByFolderId(Guid.Parse(userId.Value),id);
            var folder = await _folderRepository.GetByIdAsync(id, Guid.Parse(userId.Value));

            if (folder != null)
            {
                var available = await _accessHandler.GetAccessStateAsync(folder, 
                    Configuration.EntityRoles.Reader, Request.Headers["Authorization"]);

                if (available.IsFailure) 
                {
                    return BadRequest(available.Error);
                }
            }

            var name = folder == null ? "Instend Cloud.zip" : folder.Name + ".zip";
            var archive = fileService.CreateZipFromFiles(files);
            
            return File(archive, System.Net.Mime.MediaTypeNames.Application.Zip, name);
        }

        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult> CreateFolder([FromForm] string? folderId, [FromForm] string name, [FromForm] int queueId)
        {
            var userId = _requestHandler
                .GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            Guid.TryParse(folderId, out Guid folder);

            if (folder != Guid.Empty)
            {
                Collection? folderModel = await _folderRepository
                    .GetByIdAsync(folder, Guid.Parse(userId.Value));

                if (folderModel == null)
                    return BadRequest("Folder not found");

                var available = await _accessHandler.GetAccessStateAsync
                (
                    folderModel, 
                    Configuration.EntityRoles.Writer, 
                    Request.Headers["Authorization"]
                );

                if (available.IsFailure)
                    return BadRequest(available.Error);
            }

            var result = await _folderRepository
                .AddAsync(name, Guid.Parse(userId.Value), folder);

            if (result.IsFailure)
                return BadRequest("Failed to create folder");

            folderId = string.IsNullOrEmpty(folderId) ? userId.Value : folderId;

            await _storageHub.Clients.Group(folderId)
                .SendAsync("CreateFolder", new object[] { result.Value, queueId });

            return Ok();
        }

        [HttpPut]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> UpdateName(Guid id, Guid folderId, string name)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
                return BadRequest("Invalid name");

            if (id != Guid.Empty)
            {
                Collection? folderModel = await _folderRepository
                    .GetByIdAsync(id, Guid.Parse(userId.Value));

                if (folderModel == null)
                    return BadRequest("Folder not found");

                var available = await _accessHandler.GetAccessStateAsync
                (
                    folderModel,
                    Configuration.EntityRoles.Writer,
                    Request.Headers["Authorization"]
                );

                if (available.IsFailure)
                    return BadRequest(available.Error);
            }

            await _folderRepository.UpdateNameAsync(id, name);

            await _storageHub.Clients.Group(folderId.ToString())
                .SendAsync("RenameFolder", new object[] { id, name });

            return Ok();
        }

        [HttpDelete]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Delete(Guid folderId, Guid id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            var ownerId = Guid.Parse(userId.Value);
            var folderModel = await _folderRepository.GetByIdAsync(id, Guid.Parse(userId.Value));

            if (folderModel == null)
                return BadRequest("Folder not found");

            var available = await _accessHandler.GetAccessStateAsync
            (
                folderModel, 
                Configuration.EntityRoles.Writer, 
                Request.Headers["Authorization"]
            );

            if (available.IsFailure)
                return BadRequest(available.Error);

            ownerId = folderModel.AccountId;

            await _fileService.DeleteFolderById
            (
                _fileRespository, 
                _folderRepository, 
                _previewService, 
                id
            );

            await _storageHub.Clients.Group(folderId.ToString())
                .SendAsync("DeleteFolder", id);

            var owner = await _accountsRepository.GetByIdAsync(ownerId);

            if (owner == null)
                return Conflict("Owner not found");

            await _storageHub.Clients.Group(ownerId.ToString())
                .SendAsync("UpdateOccupiedSpace", owner.OccupiedSpace);

            return Ok();
        }
    }
}