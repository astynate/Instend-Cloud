using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
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
    public class CollectionsController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly ICollectionsRepository _collectionsRepository;

        private readonly IAccountsRepository _accountsRepository;

        private readonly IAccessHandler _accessHandler;

        private readonly IFileService _fileService;

        private readonly IFileRespository _fileRespository;

        private readonly IPreviewService _previewService;

        private readonly IHubContext<GlobalHub> _globalHub;

        public CollectionsController
        (
            IHubContext<GlobalHub> storageHub, 
            ICollectionsRepository folderRepository,
            IAccountsRepository accountsRepository,
            IFileService fileService,
            IFileRespository fileRespository,
            IRequestHandler requestHandler,
            IPreviewService previewService,
            IAccessHandler accessHandler
        )
        {
            _globalHub = storageHub;
            _accessHandler = accessHandler;
            _requestHandler = requestHandler;
            _collectionsRepository = folderRepository;
            _fileRespository = fileRespository;
            _fileService = fileService;
            _previewService = previewService;
            _accountsRepository = accountsRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> Download(Guid id, IFileRespository fileRespository, IFileService fileService)
        {
            throw new NotImplementedException();

            //var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            //if (userId.IsFailure)
            //    return BadRequest("Invalid user id");

            //var files = await fileRespository.GetByParentCollectionId(Guid.Parse(userId.Value),id);
            //var folder = await _folderRepository.GetByIdAsync(id, Guid.Parse(userId.Value));

            //if (folder != null)
            //{
            //    var available = await _accessHandler.GetAccessStateAsync(folder, 
            //        Configuration.EntityRoles.Reader, Request.Headers["Authorization"]);

            //    if (available.IsFailure) 
            //    {
            //        return BadRequest(available.Error);
            //    }
            //}

            //var name = folder == null ? "Instend Cloud.zip" : folder.Name + ".zip";
            //var archive = fileService.CreateZipFromFiles(files);
            
            //return File(archive, System.Net.Mime.MediaTypeNames.Application.Zip, name);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateFolder([FromForm] string? collectionId, [FromForm] string name, [FromForm] int queueId)
        {
            var userId = _requestHandler
                .GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            var account = await _accountsRepository.GetByIdAsync(Guid.Parse(userId.Value));

            if (account == null)
                return BadRequest("Account not found");

            Guid.TryParse(collectionId, out Guid collectionIdAsGuid);

            if (collectionIdAsGuid != Guid.Empty)
            {
                var collection = await _collectionsRepository.GetByIdAsync(collectionIdAsGuid);

                if (collection == null)
                    return BadRequest("Folder not found");

                var available = _accessHandler.GetCollectionAccessRequestResult(collection, account, Configuration.EntityRoles.Writer);

                if (available.IsFailure)
                    return BadRequest(available.Error);
            }

            var result = await _collectionsRepository
                .AddAsync(name, Guid.Parse(userId.Value), collectionIdAsGuid);

            if (result.IsFailure)
                return BadRequest("Failed to create collectionIdAsGuid");

            collectionId = string.IsNullOrEmpty(collectionId) ? userId.Value : collectionId;

            await _globalHub.Clients.Group(collectionId)
                .SendAsync("CreateFolder", new object[] { result.Value, queueId });

            return Ok();
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateName(Guid id, Guid folderId, string name)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
                return BadRequest("Invalid name");

            var account = await _accountsRepository.GetByIdAsync(Guid.Parse(userId.Value));

            if (account == null)
                return BadRequest("Account not found");

            if (id != Guid.Empty)
            {
                var collection = await _collectionsRepository.GetByIdAsync(id);

                if (collection == null)
                    return BadRequest("Folder not found");

                var available = _accessHandler.GetCollectionAccessRequestResult(collection, account, Configuration.EntityRoles.Writer);

                if (available.IsFailure)
                    return BadRequest(available.Error);
            }

            await _collectionsRepository.UpdateNameAsync(id, name);

            await _globalHub.Clients.Group(folderId.ToString())
                .SendAsync("RenameFolder", new object[] { id, name });

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(Guid folderId, Guid id)
        {
            throw new NotImplementedException();

            //var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            //if (userId.IsFailure)
            //    return BadRequest("Invalid user id");

            //var ownerId = Guid.Parse(userId.Value);
            //var collection = await _folderRepository.GetByIdAsync(id, Guid.Parse(userId.Value));

            //if (collection == null)
            //    return BadRequest("Folder not found");

            //var available = await _accessHandler.GetAccessStateAsync
            //(
            //    collection, 
            //    Configuration.EntityRoles.Writer, 
            //    Request.Headers["Authorization"]
            //);

            //if (available.IsFailure)
            //    return BadRequest(available.Error);

            //ownerId = collection.AccountId;

            //await _fileService.DeleteFolderById
            //(
            //    _fileRespository, 
            //    _folderRepository, 
            //    _previewService, 
            //    id
            //);

            //await _globalHub.Clients.Group(folderId.ToString())
            //    .SendAsync("DeleteFolder", id);

            //var owner = await _accountsRepository.GetByIdAsync(ownerId);

            //if (owner == null)
            //    return Conflict("Owner not found");

            //await _globalHub.Clients.Group(ownerId.ToString())
            //    .SendAsync("UpdateOccupiedSpace", owner.OccupiedSpace);

            //return Ok();
        }
    }
}