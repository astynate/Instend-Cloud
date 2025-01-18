using Instend.Core;
using Instend.Repositories.Storage;
using Instend.Services.External.FileService;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Instend_Version_2._0._0.Server.Hubs;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IFilesRespository _filesRespository;

        private readonly IFileService _fileService;

        private readonly ICollectionsRepository _collectionsRepository;

        private readonly IAccessHandler _accessHandler;

        private readonly IAccountsRepository _accountsRepository;

        private readonly IPreviewService _previewService;

        private readonly IRequestHandler _requestHandler;

        private readonly GlobalContext _context;

        private readonly IHubContext<GlobalHub> _globalHub;

        public FilesController
        (
            IFilesRespository filesRespository,
            ICollectionsRepository collectionsRepository,
            GlobalContext context,
            IHubContext<GlobalHub> globalHub,
            IAccessHandler accessHandler,
            IAccountsRepository accountsRepository,
            IRequestHandler requestHandler,
            IPreviewService previewService,
            IFileService fileService
        )
        {
            _filesRespository = filesRespository;
            _collectionsRepository = collectionsRepository;
            _globalHub = globalHub;
            _accessHandler = accessHandler;
            _accountsRepository = accountsRepository;
            _requestHandler = requestHandler;
            _previewService = previewService;
            _fileService = fileService;
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetFiles(Guid? id, int skip, int take)
        {
            var available = await _accessHandler
                .GetAccountAccessToCollection(id, Request, Configuration.EntityRoles.Reader);

            if (available.IsFailure)
                return Conflict(available.Error);

            var files = await _filesRespository
                .GetByParentCollectionId(available.Value.accountId, id, skip, take);

            return Ok(files);
        }

        [HttpGet]
        [Authorize]
        [Route("/api/files/{prefix}")]
        public async Task<ActionResult> GetFileByPrefix(IRequestHandler requestHandler, string prefix)
        {
            if (string.IsNullOrEmpty(prefix) || string.IsNullOrWhiteSpace(prefix))
                return BadRequest("Invalid prefix");

            var userId = requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            return Ok(await _filesRespository.GetFilesByPrefix(Guid.Parse(userId.Value), prefix));
        }

        [HttpGet]
        [Authorize]
        [Route("/api/files/download")]
        public async Task<IActionResult> Download(Guid id)
        {
            //var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            //if (userId.IsFailure)
            //    return BadRequest(userId.Error);

            //var file = await _filesRespository.GetByIdAsync(id);

            //if (file.IsFailure)
            //    return BadRequest("File not found");

            //var account = await _accountsRepository.GetByIdAsync(Guid.Parse(userId.Value));

            //if (account == null)
            //    return Conflict("Account not found");

            //var available = _accessHandler.GetFileAccessRequestResult(file.Value, account, Configuration.EntityRoles.Reader);

            //if (available.IsFailure)
            //    return BadRequest(available.Error);

            //var fileAsBytes = await _fileService.ReadFileAsync(file.Value.Path);

            //if (fileAsBytes.IsFailure)
            //    return Conflict("Cannot read file");

            //var contentType = _fileService.ConvertSystemTypeToContentType(file.Value.Type);

            //return File(fileAsBytes.Value, contentType, file.Value.Name + "." + file.Value.Type);
            return Ok();
        }

        private (string name, string? type) GetFileData(IFormFile file)
        {
            var nameSplit = file.FileName.Split(".");
            var name = nameSplit[0] ?? "Unknown";
            var type = nameSplit.Length >= 2 ? nameSplit[nameSplit.Length - 1] : null;

            return (name, type);
        }

        [HttpPost]
        [Authorize]
        [RequestSizeLimit(10L * 1024L * 1024L * 1024L)]
        [RequestFormLimits(MultipartBodyLengthLimit = 10L * 1024L * 1024L * 1024L)]
        public async Task<ActionResult<Guid>> UploadFiles([FromForm] IFormFile file, [FromForm] Guid? collectionId, [FromForm] int queueId)
        {
            var available = await _accessHandler
                .GetAccountAccessToCollection(collectionId, Request, Configuration.EntityRoles.Reader);

            if (available.IsFailure)
                return Conflict(available.Error);

            var fileData = GetFileData(file);

            return await _context.Database.CreateExecutionStrategy().ExecuteAsync<ActionResult>(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    var fileModel = await _filesRespository.AddAsync(fileData.name, fileData.type, file.Length, available.Value.accountId, collectionId);

                    if (fileModel.IsFailure)
                        return Conflict(fileModel.Error);

                    await _fileService.SaveIFormFile(file, fileModel.Value.Path);

                    var result = await _accountsRepository.ChangeOccupiedSpaceValue(available.Value.accountId, file.Length);
                    var group = fileModel.Value.CollectionId ?? available.Value.accountId;

                    if (result.IsFailure)
                        return Conflict(result.Error);

                    await _globalHub.Clients
                        .Group(group.ToString())
                        .SendAsync("UploadFile", new { fileModel.Value, queueId });

                    await transaction.CommitAsync();

                    return Ok(fileModel.Value.Id);
                }
            });
        }

        //[HttpPost]
        //[Authorize]
        //public async Task<IActionResult> CreateFile([FromForm] string name, [FromForm] string type, [FromForm] Guid collectionId, [FromForm] int queueId)
        //{
        //    throw new NotImplementedException();

        //    //var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

        //    //var collection = await _collectionsRepository.GetByIdAsync(collectionId, userId);

        //    //if (collection == null)
        //    //    return BadRequest("Collection not found");

        //    //var available = await _accessHandler.GetCollectionAccessRequestResult(collection, Configuration.EntityRoles.Writer);

        //    //if (available.IsFailure)
        //    //    return BadRequest(available.Error);

        //    //var result = await _fileRespository.AddAsync(name, type, 0, Guid.Parse(userId.Value), collectionId);
        //    //var group = result.Value.FolderId == Guid.Empty ? result.Value.AccountId.ToString() : result.Value.FolderId.ToString();

        //    //if (result.IsFailure)
        //    //    return BadRequest(result.Error);

        //    //await System.IO.File.WriteAllBytesAsync(result.Value.Path, []);
        //    //await _storageHub.Clients.Group(group).SendAsync("UploadFile", new object[] { result.Value, queueId });

        //    //return Ok();
        //}

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateName(Guid id, string name)
        {
            var access = await _accessHandler
                .GetFileAccessRequestResult(id, Request, Configuration.EntityRoles.Writer);

            if (access.IsFailure)
                return BadRequest(access.Error);

            var result = await _filesRespository.UpdateName(id, name);

            if (result.IsFailure)
                return BadRequest(result.Error);

            await _globalHub.Clients
                .Group((access.Value.file.CollectionId ?? access.Value.accountId).ToString())
                .SendAsync("RenameFile", new object[] { id, result.Value.Name });

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var access = await _accessHandler
                .GetFileAccessRequestResult(id, Request, Configuration.EntityRoles.Writer);

            if (access.IsFailure)
                return BadRequest(access.Error);

            await _context.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    await _filesRespository.Delete(id);

                    await _accountsRepository
                        .ChangeOccupiedSpaceValue(access.Value.accountId, access.Value.file.Size);

                    await transaction.CommitAsync();

                    var user = await _accountsRepository
                        .GetByIdAsync(access.Value.accountId);

                    if (user == null)
                        return;

                    await _globalHub.Clients
                        .Group((access.Value.file.CollectionId ?? access.Value.accountId).ToString())
                        .SendAsync("DeleteFile", id);

                    await _globalHub.Clients
                        .Group(access.Value.accountId.ToString())
                        .SendAsync("UpdateOccupiedSpace", user.OccupiedSpace);
                }
            });

            return Ok();
        }
    }
}