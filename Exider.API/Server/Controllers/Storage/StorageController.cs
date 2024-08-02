using Exider.Core;
using Exider.Core.Models.Storage;
using Exider.Repositories.Storage;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Exider.Repositories.Account;
using Exider.Core.Models.Formats;
using Exider.Repositories.Links;
using static Exider.Core.Models.Links.AlbumLinks;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("[controller]")]
    public class StorageController : ControllerBase
    {
        private readonly DatabaseContext _context;

        private readonly IFileRespository _fileRespository;

        private readonly IFolderRepository _folderRepository;

        private readonly IAccessHandler _accessHandler;

        private readonly ILinkBaseRepository<AlbumLink> _linkBaseRepository;

        private readonly IUserDataRepository _userDataRespository;

        private readonly IHubContext<StorageHub> _storageHub;

        private readonly IPreviewService _previewService;

        private readonly IFormatRepository<SongFormat> _songFormatRepository;

        public StorageController
        (
            DatabaseContext context,
            IFileRespository fileRespository,
            IFolderRepository folderRepository,
            IHubContext<StorageHub> storageHub,
            IAccessHandler accessHandler,
            ILinkBaseRepository<AlbumLink> linkBaseRepository,
            IUserDataRepository userDataRepository,
            IFormatRepository<SongFormat> songFormatRepository,
            IPreviewService previewService
        )
        {
            _context = context;
            _fileRespository = fileRespository;
            _folderRepository = folderRepository;
            _storageHub = storageHub;
            _accessHandler = accessHandler;
            _userDataRespository = userDataRepository;
            _songFormatRepository = songFormatRepository;
            _linkBaseRepository = linkBaseRepository;
            _previewService = previewService;
        }

        [HttpGet]
        [Authorize]
        [Route("/file")]
        public async Task<ActionResult> GetFile(IFileService fileService, string? id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Invalid file id");
            }

            var fileModel = await _fileRespository.GetByIdAsync(Guid.Parse(id));

            if (fileModel.IsFailure)
            {
                return BadRequest("File not found");
            }

            var available = await _accessHandler.GetAccessStateAsync(fileModel.Value, 
                Configuration.Abilities.Read, Request.Headers["Authorization"]);

            if (available.IsFailure)
            {
                return BadRequest(available.Error);
            }

            var file = await fileService.ReadFileAsync(fileModel.Value.Path);

            if (file.IsFailure)
            {
                return Conflict(file.Error);
            }

            return Ok(file.Value);
        }

        [HttpGet]
        [Authorize]
        [Route("/api/files/{prefix}")]
        public async Task<ActionResult> GetFileByPrevix(IRequestHandler requestHandler, string prefix)
        {
            if (string.IsNullOrEmpty(prefix) || string.IsNullOrWhiteSpace(prefix))
            {
                return BadRequest("Invalid prefix");
            }

            var userId = requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            return Ok(await _fileRespository.GetFilesByPrefix(Guid.Parse(userId.Value), prefix));
        }

        [HttpGet]
        [Authorize]
        [Route("/file/download")]
        public async Task<ActionResult> Download(IFileService fileService, string? id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Invalid file id");
            }

            var fileModel = await _fileRespository.GetByIdAsync(Guid.Parse(id));

            if (fileModel.IsFailure)
            {
                return BadRequest("File not found");
            }

            var available = await _accessHandler.GetAccessStateAsync(fileModel.Value,
                Configuration.Abilities.Read, Request.Headers["Authorization"]);

            if (available.IsFailure)
            {
                return BadRequest(available.Error);
            }

            var file = await fileService.ReadFileAsync(fileModel.Value.Path);

            if (file.IsFailure)
            {
                return Conflict("Cannot read file");
            }

            string contentType = string.IsNullOrEmpty(fileModel.Value.Type) == false ? 
                fileService.ConvertSystemTypeToContentType(fileModel.Value.Type) : "";

            return File(file.Value, contentType, fileModel.Value.Name + "." + fileModel.Value.Type);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> GetFiles(IFileService fileService, IRequestHandler requestHandler, string? id)
        {
            var idGettingResult = requestHandler.GetUserId(Request.Headers["Authorization"]);

            Guid userId = Guid.Parse(idGettingResult.Value);
            Guid folderId = id == null ? Guid.Empty : Guid.Parse(id);

            if (folderId != Guid.Empty)
            {
                FolderModel? folderModel = await _folderRepository.GetByIdAsync(folderId.ToString(), userId);

                if (folderModel == null)
                {
                    return BadRequest("Folder not found");
                }

                var available = await _accessHandler.GetAccessStateAsync(folderModel, 
                    Configuration.Abilities.Read, Request.Headers["Authorization"]);

                if (available.IsFailure)
                {
                    return BadRequest(available.Error);
                }
            }

            object[] files = await _fileRespository.GetByFolderIdWithMetaData(userId, folderId);
            FolderModel[] folders = await _folderRepository.GetFoldersByFolderId(_previewService, userId, folderId);
            FolderModel[] path = await _folderRepository.GetShortPath(folderId);

            return Ok(new object[] { folders, files, path });
        }

        [HttpPost]
        [Authorize]
        [RequestSizeLimit(10L * 1024L * 1024L * 1024L)]
        [RequestFormLimits(MultipartBodyLengthLimit = 10L * 1024L * 1024L * 1024L)]
        public async Task<ActionResult<Guid>> UploadFiles
        (
            [FromForm] IFormFile file, 
            [FromForm] string? folderId,
            [FromForm] int queueId,
            IRequestHandler requestHandler,
            IPreviewService previewService
        )
        {
            var idResult = requestHandler.GetUserId(Request.Headers["Authorization"]);
            
            Guid userId = idResult.Value == null ? Guid.Empty : Guid.Parse(idResult.Value);
            Guid ownerId = userId;

            FolderModel? folderModel = null;

            if (folderId != null)
            {
                folderModel = await _folderRepository.GetByIdAsync(folderId, userId);

                if (folderModel == null)
                {
                    return BadRequest("Folder not found");
                }

                if (folderModel.FolderType != Configuration.FolderTypes.System)
                {
                    var available = await _accessHandler.GetAccessStateAsync(folderModel,
                        Configuration.Abilities.Write, Request.Headers["Authorization"]);

                    if (available.IsFailure)
                    {
                        return BadRequest(available.Error);
                    }
                }

                ownerId = folderModel.OwnerId;
            }

            string[] nameSplit = file.FileName.Split(".");
            
            string name = nameSplit[0] ?? "Not set";
            string? type = nameSplit.Length >= 2 ? nameSplit[nameSplit.Length - 1] : null;

            return await _context.Database.CreateExecutionStrategy().ExecuteAsync<ActionResult<Guid>>(async () =>
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    var fileModel = await _fileRespository.AddAsync(name, type, file.Length, userId,
                        folderModel == null ? Guid.Empty : folderModel.Id);

                    if (fileModel.IsFailure)
                    {
                        return Conflict(fileModel.Error);
                    }

                    using (var fileStream = new FileStream(fileModel.Value.Path, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }

                    var metaData = await ProcessFileType(fileModel.Value.Id, fileModel.Value.Path, fileModel.Value.Type);

                    if (file.Length > 0)
                    {
                        await fileModel.Value.SetPreview(previewService);
                    }

                    var increaseResult = await _userDataRespository.IncreaseOccupiedSpace(ownerId, file.Length);

                    if (increaseResult.IsFailure)
                    {
                        return Conflict(increaseResult.Error);
                    }

                    await _storageHub.Clients.Group(fileModel.Value.FolderId == Guid.Empty ? fileModel.Value.OwnerId.ToString() :
                        fileModel.Value.FolderId.ToString()).SendAsync("UploadFile", new object[] { fileModel.Value, queueId, increaseResult.Value.OccupiedSpace, metaData });

                    transaction.Commit();

                    return Ok(fileModel.Value.Id);
                }
            });
        }

        [HttpPost]
        [Authorize]
        [Route("/api/albums/upload")]
        public async Task<IActionResult> UploadInAlbum
        (
            [FromForm] IFormFile file,
            [FromForm] string? folderId,
            [FromForm] int queueId,
            [FromForm] string? albumId,
            IRequestHandler requestHandler,
            IPreviewService previewService,
            IHubContext<GalleryHub> galleryHub
        )
        {
            if (string.IsNullOrEmpty(albumId) || string.IsNullOrWhiteSpace(albumId))
            {
                return BadRequest("Album not found");
            }

            ActionResult<Guid> uploadedFile = await UploadFiles(file, folderId, queueId, requestHandler, previewService);

            if (uploadedFile.Result is OkObjectResult okObjectResult)
            {
                if (okObjectResult.Value == null)
                {
                    return Conflict("Error when trying to upload a file");
                }

                string? actionResult = okObjectResult.Value.ToString();

                if (actionResult == null)
                {
                    return Conflict("Error when trying to upload a file");
                }

                var result = await _linkBaseRepository.AddFileToAlbum(Guid.Parse(albumId), Guid.Parse(actionResult));

                if (result.IsFailure)
                {
                    return Conflict(result.Error);
                }

                await galleryHub.Clients.Group(albumId).SendAsync("AddToAlbum", new object[] { result.Value, albumId });

                return Ok();
            }

            return Conflict("Error when trying to upload a file");
        }

        [HttpPost]
        [Authorize]
        [Route("/file")]
        public async Task<IActionResult> CreateFile
        (
            [FromForm] string name, 
            [FromForm] string type, 
            [FromForm] string? folderId,
            [FromForm] int queueId,
            IRequestHandler requestHandler
        )
        {
            var idResult = requestHandler.GetUserId(Request.Headers["Authorization"]);

            Guid userId = idResult.Value == null ? Guid.Empty : Guid.Parse(idResult.Value);
            Guid folderIdAsGuid = string.IsNullOrEmpty(folderId) ? Guid.Empty : Guid.Parse(folderId);

            if (folderId != null)
            {
                FolderModel? folderModel = await _folderRepository.GetByIdAsync(folderId, userId);

                if (folderModel == null)
                {
                    return BadRequest("Folder not found");
                }

                var available = await _accessHandler.GetAccessStateAsync(folderModel,
                    Configuration.Abilities.Write, Request.Headers["Authorization"]);

                if (available.IsFailure)
                {
                    return BadRequest(available.Error);
                }
            }

            var result = await _fileRespository.AddAsync(name, type, 0, userId, folderIdAsGuid);

            if (result.IsFailure)
            {
                return BadRequest(result.Error);
            }

            await System.IO.File.WriteAllBytesAsync(result.Value.Path, new byte[0]);

            await _storageHub.Clients.Group(result.Value.FolderId == Guid.Empty ? result.Value.OwnerId.ToString() :
                result.Value.FolderId.ToString()).SendAsync("UploadFile", new object[] { result.Value, queueId });

            return Ok();
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateName(Guid id, string name)
        {
            if (id == Guid.Empty)
            {
                return BadRequest("File not found");
            }

            var fileModel = await _fileRespository.GetByIdAsync(id);

            if (fileModel.IsFailure)
            {
                return BadRequest("File not found");
            }

            var available = await _accessHandler.GetAccessStateAsync(fileModel.Value, 
                Configuration.Abilities.Write, Request.Headers["Authorization"]);

            if (available.IsFailure)
            {
                return BadRequest(available.Error);
            }

            var result = await _fileRespository.UpdateName(id, name);

            if (result.IsFailure)
            {
                return BadRequest(result.Error);
            }

            await _storageHub.Clients.Group(result.Value.FolderId == Guid.Empty ? result.Value.OwnerId.ToString() : 
                result.Value.FolderId.ToString()).SendAsync("RenameFile", result.Value);

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(IUserDataRepository userRepository, Guid id, Guid folderId)
        {
            if (id == Guid.Empty)
            {
                return BadRequest("File not found");
            }

            var fileModel = await _fileRespository.GetByIdAsync(id);

            if (fileModel.IsFailure)
            {
                return BadRequest("File not found");
            }

            var available = await _accessHandler.GetAccessStateAsync(fileModel.Value,
                Configuration.Abilities.Write, Request.Headers["Authorization"]);

            if (available.IsFailure)
            {
                return BadRequest(available.Error);
            }

            var result = await _fileRespository.Delete(id);

            if (result.IsFailure)
            {
                return BadRequest(result.Error);
            }

            await _storageHub.Clients.Group(folderId.ToString())
                .SendAsync("DeleteFile", id);

            await userRepository.DecreaseOccupiedSpace(fileModel.Value.OwnerId, fileModel.Value.Size);

            var user = await userRepository.GetUserAsync(fileModel.Value.OwnerId);

            if (user.IsFailure)
            {
                return Conflict("User not found");
            }

            await _storageHub.Clients.Group(fileModel.Value.OwnerId.ToString())
                .SendAsync("UpdateOccupiedSpace", user.Value.OccupiedSpace);

            return Ok();
        }

        private async Task<object?> ProcessFileType(Guid fileId, string path, string? type)
        {
            if (type == null)
            {
                return null;
            }

            if (SongFormat.SongTypes.Contains(type))
            {
                var result = await _songFormatRepository.AddAsync(fileId, type, path);

                if (result.IsFailure)
                {
                    return null;
                }

                return result.Value;
            }

            return null;
        }
    }
}