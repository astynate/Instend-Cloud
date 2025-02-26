﻿using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Helpers;
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
    [Route("/api/[controller]")]
    public class CollectionsController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly ICollectionsRepository _collectionsRepository;

        private readonly IAccountsRepository _accountsRepository;

        private readonly ISerializationHelper _serializationHelper;

        private readonly IAccessHandler _accessHandler;

        private readonly IFileService _fileService;

        private readonly IFilesRespository _fileRespository;

        private readonly IPreviewService _previewService;

        private readonly IHubContext<GlobalHub> _globalHub;

        public CollectionsController
        (
            IHubContext<GlobalHub> storageHub, 
            ICollectionsRepository folderRepository,
            IAccountsRepository accountsRepository,
            ISerializationHelper serializationHelper,
            IFileService fileService,
            IFilesRespository fileRespository,
            IRequestHandler requestHandler,
            IPreviewService previewService,
            IAccessHandler accessHandler
        )
        {
            _globalHub = storageHub;
            _accessHandler = accessHandler;
            _requestHandler = requestHandler;
            _collectionsRepository = folderRepository;
            _serializationHelper = serializationHelper;
            _fileRespository = fileRespository;
            _fileService = fileService;
            _previewService = previewService;
            _accountsRepository = accountsRepository;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/collections/{id}")]
        public async Task<IActionResult> GetCollections(Guid id)
        {
            var collection = await _collectionsRepository.GetByIdAsync(id);

            if (collection == null)
                return Conflict("Collection is not found");

            return Ok(_serializationHelper.SerializeWithCamelCase(collection));
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCollections(Guid? id, int skip, int take)
        {
            var available = await _accessHandler
                .GetAccountAccessToCollection(id, Request, Configuration.EntityRoles.Reader);

            if (available.IsFailure)
                return Conflict(available.Error);

            var path = await _collectionsRepository
                .GetCollectionsByParentId(available.Value.accountId, id, skip, take);

            return Ok(path);
        }

        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/download")]
        public async Task<IActionResult> Download(Guid? id)
        {
            var available = await _accessHandler.GetAccountAccessToCollection
            (
                id, 
                Request, 
                Configuration.EntityRoles.Reader
            );

            if (available.IsFailure)
                return Conflict(available.Error);

            var files = await _fileRespository.GetByParentCollectionId
            (
                available.Value.accountId,
                id,
                0,
                int.MaxValue
            );

            var name = available.Value.collection == null ? "Instend Cloud.zip" : available.Value.collection.Name + ".zip";
            var archive = _fileService.CreateZipFromFiles(files);

            return File(archive, System.Net.Mime.MediaTypeNames.Application.Zip, name);
        }

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]")]
        public async Task<ActionResult> CreateCollection([FromForm] Guid? collectionId, [FromForm] string name, [FromForm] int queueId)
        {
            var accountId = _requestHandler
                .GetUserId(Request.Headers["Authorization"]);

            if (accountId.IsFailure)
                return BadRequest("Invalid user id");

            var account = await _accountsRepository
                .GetByIdAsync(Guid.Parse(accountId.Value));

            if (account == null)
                return Conflict("Account not found");

            var available = await _accessHandler.GetAccountAccessToCollection
            (
                collectionId, 
                Request,
                Configuration.EntityRoles.Writer
            );

            if (available.IsFailure)
                return BadRequest(available.Error);

            var result = await _collectionsRepository
                .AddAsync(name, account, collectionId, Configuration.CollectionTypes.Ordinary);

            if (result.IsFailure)
                return BadRequest("Failed to create collection");

            var groupId = collectionId.HasValue == false ? Guid.Parse(accountId.Value) : collectionId;

            await _globalHub.Clients
                .Group(groupId.ToString() ?? "")
                .SendAsync("CreateCollection", _serializationHelper.SerializeWithCamelCase(new object[] { result.Value, queueId }));

            return Ok();
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateName(Guid id, Guid? collectionId, string name)
        {
            var available = await _accessHandler.GetAccountAccessToCollection
            (
                collectionId, 
                Request, 
                Configuration.EntityRoles.Writer
            );

            if (available.IsFailure)
                return Conflict(available.Error);

            await _collectionsRepository.UpdateNameAsync(id, name);

            await _globalHub.Clients.Group((collectionId ?? available.Value.accountId).ToString())
                .SendAsync("RenameCollection", new object[] { id, name });

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var available = await _accessHandler.GetAccountAccessToCollection
            (
                id,
                Request,
                Configuration.EntityRoles.Writer
            );

            if (available.IsFailure)
                return Conflict(available.Error);

            await _collectionsRepository.DeleteAsync(id);

            await _globalHub.Clients
                .Group(available.Value.collection?.Id.ToString() ?? available.Value.accountId.ToString())
                .SendAsync("DeleteCollection", id);

            return Ok();
        }
    }
}