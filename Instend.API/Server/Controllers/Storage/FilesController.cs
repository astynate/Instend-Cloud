﻿using Instend.Core;
using Instend.Repositories.Storage;
using Instend.Services.External.FileService;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Instend_Version_2._0._0.Server.Hubs;
using Instend.Core.Dependencies.Repositories.Account;

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

        private readonly IHubContext<GlobalHub> _globalHub;

        public FilesController
        (
            IFilesRespository filesRespository,
            ICollectionsRepository collectionsRepository,
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
                .GetByParentCollectionId(available.Value.accountId, id ?? Guid.Empty, skip, take);

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

        [HttpPost]
        [Authorize]
        [RequestSizeLimit(10L * 1024L * 1024L * 1024L)]
        [RequestFormLimits(MultipartBodyLengthLimit = 10L * 1024L * 1024L * 1024L)]
        public async Task<ActionResult<Guid>> UploadFiles([FromForm] IFormFile file, [FromForm] Guid collectionId, [FromForm] int queueId)
        {
            throw new NotImplementedException();
            //var userId = Guid.Parse(_requestHandler.GetUserId(Request.Headers["Authorization"]).Value);
            //var ownerId = userId;

            //Collection? collection = null;

            //if (collectionId != Guid.Empty)
            //{
            //    collection = await _collectionsRepository.GetByIdAsync(collectionId, userId);

            //    if (collection == null)
            //        return BadRequest("Folder not found");

            //    if (collection.Type != Configuration.CollectionTypes.System)
            //    {
            //        var available = await _accessHandler.GetAccessStateAsync(collection,
            //            Configuration.EntityRoles.Writer, Request.Headers["Authorization"]);

            //        if (available.IsFailure)
            //            return BadRequest(available.Error);
            //    }

            //    ownerId = collection.AccountId;
            //}

            //var nameSplit = file.FileName.Split(".");
            //var name = nameSplit[0] ?? "Not set";
            //var type = nameSplit.Length >= 2 ? nameSplit[nameSplit.Length - 1] : null;

            //return await _context.Database.CreateExecutionStrategy().ExecuteAsync<ActionResult<Guid>>(async () =>
            //{
            //    using (var transaction = _context.Database.BeginTransaction())
            //    {
            //        var fileModel = await _fileRespository.AddAsync(name, type, file.Length, userId,
            //            collection == null ? Guid.Empty : collection.Id);

            //        if (fileModel.IsFailure)
            //            return Conflict(fileModel.Error);

            //        using (var fileStream = new FileStream(fileModel.Value.Path, FileMode.Create))
            //        {
            //            await file.CopyToAsync(fileStream);
            //        }

            //        var metaData = await ProcessFileType
            //        (
            //            fileModel.Value.Id, 
            //            fileModel.Value.Path, 
            //            fileModel.Value.Type
            //        );

            //        if (file.Length > 0)
            //            await fileModel.Value.SetPreview(_previewService);

            //        var result = await _accountsRepository.ChangeOccupiedSpaceValue(ownerId, file.Length);
            //        var group = fileModel.Value.FolderId == Guid.Empty ? fileModel.Value.AccountId.ToString() : fileModel.Value.FolderId.ToString();

            //        if (result.IsFailure)
            //            return Conflict(result.Error);

            //        await _storageHub.Clients
            //            .Group(group)
            //            .SendAsync("UploadFile", new object?[] { fileModel.Value, queueId, result.Value, metaData });

            //        transaction.Commit();

            //        return Ok(fileModel.Value.Id);
            //    }
            //});
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateFile([FromForm] string name, [FromForm] string type, [FromForm] Guid collectionId, [FromForm] int queueId)
        {
            throw new NotImplementedException();

            //var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            //var collection = await _collectionsRepository.GetByIdAsync(collectionId, userId);

            //if (collection == null)
            //    return BadRequest("Collection not found");

            //var available = await _accessHandler.GetCollectionAccessRequestResult(collection, Configuration.EntityRoles.Writer);

            //if (available.IsFailure)
            //    return BadRequest(available.Error);

            //var result = await _fileRespository.AddAsync(name, type, 0, Guid.Parse(userId.Value), collectionId);
            //var group = result.Value.FolderId == Guid.Empty ? result.Value.AccountId.ToString() : result.Value.FolderId.ToString();

            //if (result.IsFailure)
            //    return BadRequest(result.Error);

            //await System.IO.File.WriteAllBytesAsync(result.Value.Path, []);
            //await _storageHub.Clients.Group(group).SendAsync("UploadFile", new object[] { result.Value, queueId });

            //return Ok();
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateName(Guid id, string name)
        {
            throw new NotImplementedException();

            //var fileModel = await _fileRespository.GetByIdAsync(id);

            //if (fileModel.IsFailure)
            //    return BadRequest("File not found");

            //var available = await _accessHandler.GetAccessStateAsync(fileModel.Value, 
            //    Configuration.EntityRoles.Writer, Request.Headers["Authorization"]);

            //if (available.IsFailure)
            //    return BadRequest(available.Error);

            //var result = await _fileRespository.UpdateName(id, name);

            //if (result.IsFailure)
            //    return BadRequest(result.Error);

            //await _storageHub.Clients.Group(result.Value.FolderId == Guid.Empty ? result.Value.AccountId.ToString() : 
            //    result.Value.FolderId.ToString()).SendAsync("RenameFile", result.Value);

            //return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id, Guid folderId)
        {
            throw new NotImplementedException();

            //var fileModel = await _fileRespository.GetByIdAsync(id);

            //if (fileModel.IsFailure)
            //    return BadRequest("File not found");

            //var available = await _accessHandler.GetAccessStateAsync(fileModel.Value,
            //    Configuration.EntityRoles.Writer, Request.Headers["Authorization"]);

            //if (available.IsFailure)
            //    return BadRequest(available.Error);

            //var result = await _fileRespository.Delete(id);

            //if (result.IsFailure)
            //    return BadRequest(result.Error);

            //await _storageHub.Clients.Group(folderId.ToString())
            //    .SendAsync("DeleteFile", id);

            //await _accountsRepository
            //    .ChangeOccupiedSpaceValue(fileModel.Value.AccountId, -fileModel.Value.Size);

            //var user = await _accountsRepository
            //    .GetByIdAsync(fileModel.Value.AccountId);

            //if (user == null)
            //    return Conflict("User not found");

            //await _storageHub.Clients.Group(fileModel.Value.AccountId.ToString())
            //    .SendAsync("UpdateOccupiedSpace", user.OccupiedSpace);

            //return Ok();
        }
    }
}