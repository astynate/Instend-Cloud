using Instend.Core;
using Instend.Repositories.Gallery;
using Instend.Repositories.Storage;
using Instend.Services.External.FileService;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.Hubs;
using Instend.Core.Dependencies.Repositories.Account;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Storage.Album;

namespace Instend_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private readonly IFileRespository _fileRespository;

        private readonly ICollectionsRepository _folderRespository;

        private readonly IRequestHandler _requestHandler;

        private readonly IAccountsRepository _accountsRepository;

        private readonly IAlbumsRepository _albumsRepository;

        private readonly IAccessHandler _accessHandler;

        private readonly IImageService _imageService;

        private readonly IHubContext<GlobalHub> _globalHub;

        private AccountsContext _context;

        public GalleryController
        (
            IFileRespository fileRespository, 
            IRequestHandler requestHandler, 
            IAlbumsRepository albumRepository,
            ICollectionsRepository folderRepository,
            IHubContext<GlobalHub> globalHub,
            IAccountsRepository accountsRepository,
            IAccessHandler accessHandler,
            IImageService imageService,
            AccountsContext context
        )
        {
            _fileRespository = fileRespository;
            _requestHandler = requestHandler;
            _albumsRepository = albumRepository;
            _folderRespository = folderRepository;
            _globalHub = globalHub;
            _context = context;
            _accountsRepository = accountsRepository;
            _accessHandler = accessHandler;
            _imageService = imageService;
        }

        public class CreateAlbumTransferObject
        {
            public IFormFile? cover { get; init; }
            public string? name { get; init; }
            public string? description { get; init; }
            public int queueid { get; init; }
        }

        [HttpGet]
        [Route("/api/albums")]
        [Authorize]
        public async Task<ActionResult<Album[]>> GetAlbums(int skip, int take) 
            => await GetAlbums(Configuration.AlbumTypes.Album, skip, take);

        [HttpGet]
        [Route("/api/playlists")]
        [Authorize]
        public async Task<ActionResult<Album[]>> GetPlaylists(int skip, int take) 
            => await GetAlbums(Configuration.AlbumTypes.Playlist, skip, take);

        [HttpGet]
        [Authorize]
        [Route("/api/album")]
        public async Task<IActionResult> GetAlbum(string id, int from, int count)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Invalid album id");

            var userId = _requestHandler
                .GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var result = await _albumsRepository
                .GetByIdAsync(Guid.Parse(id), from, count);

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        [Route("/api/albums/create")]
        public async Task<IActionResult> CreateAlbumWithDefaultType([FromForm] CreateAlbumTransferObject createTO)
            => await CreateAlbumWithType(createTO, Configuration.AlbumTypes.Album);

        [HttpPost]
        [Authorize]
        [Route("/api/playlists/create")]
        public async Task<IActionResult> CreateAlbumWithPlaylistType([FromForm] CreateAlbumTransferObject createTO)
            => await CreateAlbumWithType(createTO, Configuration.AlbumTypes.Playlist);

        private async Task<ActionResult<Album[]>> GetAlbums(Configuration.AlbumTypes type, int skip, int take)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var result = await _albumsRepository
                .GetAlbums(Guid.Parse(userId.Value), type, skip, take);

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        [Route("/api/gallery/upload")]
        public async Task<IActionResult> UploadToGallery
        (
            IPreviewService previewService,
            IHubContext<GlobalHub> globalHub,
            [FromForm] IFormFile file,
            [FromForm] string? albumId,
            [FromForm] int queueId
        )
        {
            throw new NotImplementedException();

            //var accountId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            //if (accountId.IsFailure)
            //    return Unauthorized(accountId.Error);

            //var account = await _accountsRepository
            //    .GetByIdAsync(Guid.Parse(accountId.Value));

            //if (account == null)
            //    return BadRequest("User not found");

            //var splitedName = file.FileName.Split(".");
            
            //var fileName = splitedName[0] ?? "Not set";
            //var fileType = splitedName.Length >= 2 ? splitedName[splitedName.Length - 1] : null;

            //if (fileType == null || Configuration.imageTypes.Contains(fileType.ToLower()) == false)
            //    return BadRequest("Invalid fileType");

            //return await _context.Database.CreateExecutionStrategy().ExecuteAsync<IActionResult>(async () =>
            //{
            //    using (var transaction = _context.Database.BeginTransaction())
            //    {
            //        var fileModel = await _fileRespository.AddPhotoAsync
            //        (
            //            fileName, 
            //            fileType, 
            //            file.Length, 
            //            Guid.Parse(accountId.Value)
            //        );

            //        if (fileModel.IsFailure)
            //            return Conflict(fileModel.Error);

            //        if (file.Length > 0 && fileModel.IsFailure == false)
            //        {
            //            using (var fileStream = new FileStream(fileModel.Value.Path, FileMode.Create))
            //            {
            //                await file.CopyToAsync(fileStream);
            //            }

            //            await fileModel.Value.SetPreview(previewService);
            //        }

            //        if (string.IsNullOrEmpty(albumId) == false && string.IsNullOrWhiteSpace(albumId) == false)
            //        {
            //            //var result = await _albumRepository.(fileModel.Value, Guid.Parse(albumId));

            //            //if (result.IsFailure)
            //            //    return Conflict(result.Error);

            //            await _globalHub.Clients.Group(albumId)
            //                .SendAsync("Upload", new object[] { fileModel.Value, albumId, queueId });
            //        }

            //        var space = await _accountsRepository
            //            .ChangeOccupiedSpaceValue(Guid.Parse(accountId.Value), file.Length);

            //        if (space.IsFailure)
            //            return Conflict(space.Error);

            //        await globalHub.Clients.Group(fileModel.Value.AccountId.ToString())
            //            .SendAsync("UploadFile", new object[] { fileModel.Value, queueId });

            //        await globalHub.Clients.Group(fileModel.Value.AccountId.ToString())
            //            .SendAsync("UpdateOccupiedSpace", account.OccupiedSpace + file.Length);

            //        transaction.Commit();
                    
            //        return Ok();
            //    }
            //});
        }

        private async Task<IActionResult> CreateAlbumWithType(CreateAlbumTransferObject createTO, Configuration.AlbumTypes type)
        {
            throw new NotImplementedException();

            //var accountId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            //if (accountId.IsFailure)
            //    return BadRequest(accountId.Error);

            //if (string.IsNullOrEmpty(createTO.name) || string.IsNullOrWhiteSpace(createTO.name))
            //    return BadRequest("Name is required.");

            //var coverAsBytes = new byte[0];

            //using (var coverStream = new MemoryStream())
            //{
            //    if (createTO.cover != null && createTO.cover.Length > 0)
            //    {
            //        await createTO.cover.CopyToAsync(coverStream);
            //        coverAsBytes = coverStream.ToArray();
            //    }
            //}

            //var result = await _albumsRepository.AddAsync
            //(
            //    Guid.Parse(accountId.Value), 
            //    coverAsBytes,
            //    createTO.name,
            //    createTO.description, 
            //    type
            //);

            //if (result.IsFailure)
            //    return BadRequest(result.Error);

            //await result.Value.SetCover(_imageService);

            //await _globalHub.Clients.Group(result.Value.AccountId.ToString())
            //    .SendAsync("Create", new object[] { result.Value, createTO.queueid });

            return Ok();
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> EditAlbum
        (
            IImageService imageService,
            [FromForm] IFormFile? cover,
            [FromForm] string? name,
            [FromForm] string? description,
            [FromForm] string? id
        )
        {
            throw new NotImplementedException();

            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Album not found");

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Name is required");

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var coverAsBytes = new byte[0];

            using (var coverStream = new MemoryStream())
            {
                if (cover != null && cover.Length > 0)
                {
                    await cover.CopyToAsync(coverStream);
                    coverAsBytes = coverStream.ToArray();
                }
            }

            var result = await _albumsRepository
                .UpdateAlbum(Guid.Parse(id), coverAsBytes, name, description);

            if (result.IsFailure)
                return Conflict(result.Error);

            await _globalHub.Clients.Group(id.ToString())
                .SendAsync("Update", new { id, coverAsBytes, name, description });

            return Ok();
        }

        [Authorize]
        [HttpDelete]
        [Route("/api/albums")]
        public async Task<IActionResult> DeleteAlbum(string id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Invalid id");

            var result = await _albumsRepository.DeleteAlbumAsync(Guid.Parse(id), Guid.Parse(userId.Value));

            if (result.IsFailure)
                return BadRequest(result.Error);

            await _globalHub.Clients
                .Group(userId.Value.ToString())
                .SendAsync("DeleteAlbum", id);

            return Ok();
        }
    }
}