using Instend.Core;
using Instend.Repositories.Storage;
using Instend.Services.External.FileService;
using Instend.Services.Internal.Handlers;
using Instend.Core.Models.Formats;
using Instend.Repositories.Links;
using Instend_Version_2._0._0.Server.Hubs;
using Instend.Core.Dependencies.Repositories.Account;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Storage.Album;
using Instend.Core.Models.Storage.Collection;

namespace Instend_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("[controller]")]
    public class StorageController : ControllerBase
    {
        private readonly AccountsContext _context;

        private readonly IFileRespository _fileRespository;

        private readonly IFolderRepository _folderRepository;

        private readonly IAccessHandler _accessHandler;

        private readonly IAccountsRepository _accountsRepository;

        private readonly IPreviewService _previewService;

        private readonly IRequestHandler _requestHandler;

        private readonly IHubContext<GalleryHub> _galleryHub;

        private readonly IHubContext<StorageHub> _storageHub;

        private readonly IFormatRepository<SongFormat> _songFormatRepository;

        public StorageController
        (
            AccountsContext context,
            IFileRespository fileRespository,
            IFolderRepository folderRepository,
            IHubContext<StorageHub> storageHub,
            IHubContext<GalleryHub> galleryHub,
            IAccessHandler accessHandler,
            IAccountsRepository userDataRepository,
            IRequestHandler requestHandler,
            IFormatRepository<SongFormat> songFormatRepository,
            IPreviewService previewService
        )
        {
            _context = context;
            _fileRespository = fileRespository;
            _folderRepository = folderRepository;
            _storageHub = storageHub;
            _accessHandler = accessHandler;
            _accountsRepository = userDataRepository;
            _songFormatRepository = songFormatRepository;
            _requestHandler = requestHandler;
            _previewService = previewService;
            _galleryHub = galleryHub;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/Files/{prefix}")]
        public async Task<ActionResult> GetFileByPrevix(IRequestHandler requestHandler, string prefix)
        {
            if (string.IsNullOrEmpty(prefix) || string.IsNullOrWhiteSpace(prefix))
                return BadRequest("Invalid prefix");

            var userId = requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            return Ok(await _fileRespository.GetFilesByPrefix(Guid.Parse(userId.Value), prefix));
        }

        [HttpGet]
        [Authorize]
        [Route("/file/download")]
        public async Task<ActionResult> Download(IFileService fileService, string? id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Invalid file id");

            var fileModel = await _fileRespository.GetByIdAsync(Guid.Parse(id));

            if (fileModel.IsFailure)
                return BadRequest("File not found");

            var available = await _accessHandler.GetAccessStateAsync(fileModel.Value,
                Configuration.Abilities.Read, Request.Headers["Authorization"]);

            if (available.IsFailure)
                return BadRequest(available.Error);

            var file = await fileService.ReadFileAsync(fileModel.Value.Path);

            if (file.IsFailure)
                return Conflict("Cannot read file");

            string contentType = string.IsNullOrEmpty(fileModel.Value.Type) == false ? 
                fileService.ConvertSystemTypeToContentType(fileModel.Value.Type) : "";

            return File(file.Value, contentType, fileModel.Value.Name + "." + fileModel.Value.Type);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> GetFiles(IFileService fileService, IRequestHandler requestHandler, string? id)
        {
            var userId = Guid.Parse(requestHandler.GetUserId(Request.Headers["Authorization"]).Value);
            var folderId = id == null ? Guid.Empty : Guid.Parse(id);

            if (folderId != Guid.Empty)
            {
                var folderModel = await _folderRepository.GetByIdAsync(folderId, userId);

                if (folderModel == null)
                    return BadRequest("Folder not found");

                var available = await _accessHandler.GetAccessStateAsync(folderModel, 
                    Configuration.Abilities.Read, Request.Headers["Authorization"]);

                if (available.IsFailure)
                    return BadRequest(available.Error);
            }

            var files = await _fileRespository.GetByFolderIdWithMetaData(userId, folderId);
            var folders = await _folderRepository.GetFoldersByFolderId(userId, folderId);
            var path = await _folderRepository.GetShortPath(folderId);

            return Ok(new object[] { folders, files, path });
        }

        [HttpPost]
        [Authorize]
        [RequestSizeLimit(10L * 1024L * 1024L * 1024L)]
        [RequestFormLimits(MultipartBodyLengthLimit = 10L * 1024L * 1024L * 1024L)]
        public async Task<ActionResult<Guid>> UploadFiles([FromForm] IFormFile file, [FromForm] Guid folderId, [FromForm] int queueId)
        {
            var userId = Guid.Parse(_requestHandler.GetUserId(Request.Headers["Authorization"]).Value);
            var ownerId = userId;

            Collection? folderModel = null;

            if (folderId != null)
            {
                folderModel = await _folderRepository.GetByIdAsync(folderId, userId);

                if (folderModel == null)
                    return BadRequest("Folder not found");

                if (folderModel.FolderType != Configuration.CollectionTypes.System)
                {
                    var available = await _accessHandler.GetAccessStateAsync(folderModel,
                        Configuration.Abilities.Write, Request.Headers["Authorization"]);

                    if (available.IsFailure)
                        return BadRequest(available.Error);
                }

                ownerId = folderModel.AccountId;
            }

            var nameSplit = file.FileName.Split(".");
            var name = nameSplit[0] ?? "Not set";
            var type = nameSplit.Length >= 2 ? nameSplit[nameSplit.Length - 1] : null;

            return await _context.Database.CreateExecutionStrategy().ExecuteAsync<ActionResult<Guid>>(async () =>
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    var fileModel = await _fileRespository.AddAsync(name, type, file.Length, userId,
                        folderModel == null ? Guid.Empty : folderModel.Id);

                    if (fileModel.IsFailure)
                        return Conflict(fileModel.Error);

                    using (var fileStream = new FileStream(fileModel.Value.Path, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }

                    var metaData = await ProcessFileType
                    (
                        fileModel.Value.Id, 
                        fileModel.Value.Path, 
                        fileModel.Value.Type
                    );

                    if (file.Length > 0)
                        await fileModel.Value.SetPreview(_previewService);

                    var result = await _accountsRepository.ChangeOccupiedSpaceValue(ownerId, file.Length);
                    var group = fileModel.Value.FolderId == Guid.Empty ? fileModel.Value.AccountId.ToString() : fileModel.Value.FolderId.ToString();

                    if (result.IsFailure)
                        return Conflict(result.Error);

                    await _storageHub.Clients
                        .Group(group)
                        .SendAsync("UploadFile", new object?[] { fileModel.Value, queueId, result.Value, metaData });

                    transaction.Commit();

                    return Ok(fileModel.Value.Id);
                }
            });
        }

        [HttpPost]
        [Authorize]
        [Route("/api/albums/upload")]
        public async Task<IActionResult> UploadInAlbum([FromForm] IFormFile file, [FromForm] Guid folderId, [FromForm] int queueId, [FromForm] string? albumId)
        {
            if (string.IsNullOrEmpty(albumId) || string.IsNullOrWhiteSpace(albumId))
                return BadRequest("Album not found");

            var uploadedFile = await UploadFiles(file, folderId, queueId);

            if (uploadedFile.Result is not OkObjectResult okObjectResult)
                return Conflict("Error when trying to upload a file");

            if (okObjectResult.Value == null)
                return Conflict("Error when trying to upload a file");

            var actionResult = okObjectResult.Value.ToString();

            if (actionResult == null)
                return Conflict("Error when trying to upload a file");

            var result = await _linkBaseRepository.AddFileToAlbum(Guid.Parse(albumId), Guid.Parse(actionResult));

            if (result.IsFailure)
                return Conflict(result.Error);

            await _galleryHub.Clients
                .Group(albumId)
                .SendAsync("AddToAlbum", new object[] { result.Value, albumId });

            return Ok();
        }

        [HttpPost]
        [Authorize]
        [Route("/file")]
        public async Task<IActionResult> CreateFile([FromForm] string name, [FromForm] string type, [FromForm] Guid folderId, [FromForm] int queueId)
        {
            var userId = Guid.Parse(_requestHandler.GetUserId(Request.Headers["Authorization"]).Value);
            var folderModel = await _folderRepository.GetByIdAsync(folderId, userId);

            if (folderModel == null)
                return BadRequest("Folder not found");

            var available = await _accessHandler.GetAccessStateAsync(folderModel,
                Configuration.Abilities.Write, Request.Headers["Authorization"]);

            if (available.IsFailure)
                return BadRequest(available.Error);

            var result = await _fileRespository.AddAsync(name, type, 0, userId, folderId);
            var group = result.Value.FolderId == Guid.Empty ? result.Value.AccountId.ToString() : result.Value.FolderId.ToString();

            if (result.IsFailure)
                return BadRequest(result.Error);

            await System.IO.File.WriteAllBytesAsync(result.Value.Path, []);
            await _storageHub.Clients.Group(group).SendAsync("UploadFile", new object[] { result.Value, queueId });

            return Ok();
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateName(Guid id, string name)
        {
            var fileModel = await _fileRespository.GetByIdAsync(id);

            if (fileModel.IsFailure)
                return BadRequest("File not found");

            var available = await _accessHandler.GetAccessStateAsync(fileModel.Value, 
                Configuration.Abilities.Write, Request.Headers["Authorization"]);

            if (available.IsFailure)
                return BadRequest(available.Error);

            var result = await _fileRespository.UpdateName(id, name);

            if (result.IsFailure)
                return BadRequest(result.Error);

            await _storageHub.Clients.Group(result.Value.FolderId == Guid.Empty ? result.Value.AccountId.ToString() : 
                result.Value.FolderId.ToString()).SendAsync("RenameFile", result.Value);

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id, Guid folderId)
        {
            var fileModel = await _fileRespository.GetByIdAsync(id);

            if (fileModel.IsFailure)
                return BadRequest("File not found");

            var available = await _accessHandler.GetAccessStateAsync(fileModel.Value,
                Configuration.Abilities.Write, Request.Headers["Authorization"]);

            if (available.IsFailure)
                return BadRequest(available.Error);

            var result = await _fileRespository.Delete(id);

            if (result.IsFailure)
                return BadRequest(result.Error);

            await _storageHub.Clients.Group(folderId.ToString())
                .SendAsync("DeleteFile", id);

            await _accountsRepository
                .ChangeOccupiedSpaceValue(fileModel.Value.AccountId, -fileModel.Value.Size);

            var user = await _accountsRepository
                .GetByIdAsync(fileModel.Value.AccountId);

            if (user == null)
                return Conflict("User not found");

            await _storageHub.Clients.Group(fileModel.Value.AccountId.ToString())
                .SendAsync("UpdateOccupiedSpace", user.OccupiedSpace);

            return Ok();
        }

        private async Task<object?> ProcessFileType(Guid fileId, string path, string? type)
        {
            if (type == null || SongFormat.SongTypes.Contains(type) == false)
                return null;

            var result = await _songFormatRepository
                .AddAsync(fileId, type, path);

            if (result.IsFailure)
                return null;

            return result.Value;
        }
    }
}