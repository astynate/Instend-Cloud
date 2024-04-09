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

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("[controller]")]
    public class StorageController : ControllerBase
    {
        private readonly DatabaseContext _context;

        private readonly IFileRespository _fileRespository;

        private readonly IFolderRepository _folderRepository;

        private readonly IHubContext<StorageHub> _storageHub;

        private readonly IFileService _fileService;

        public StorageController
        (
            DatabaseContext context,
            IFileRespository fileRespository,
            IFolderRepository folderRepository,
            IHubContext<StorageHub> storageHub,
            IFileService fileService
        )
        {
            _context = context;
            _fileRespository = fileRespository;
            _folderRepository = folderRepository;
            _storageHub = storageHub;
            _fileService = fileService;
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

            var file = fileService.GetFileAsHTMLBase64String(fileModel.Value);

            if (file.IsFailure)
            {
                return BadRequest(file.Error);
            }

            return Ok(file.Value);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> GetFiles(IFileService fileService, IRequestHandler requestHandler, string? id)
        {
            var idGettingResult = requestHandler.GetUserId(Request.Headers["Authorization"]);

            Guid userId = Guid.Parse(idGettingResult.Value);
            Guid folderId = id == null ? Guid.Empty : Guid.Parse(id);

            FileModel[] files = await _fileRespository.GetByFolderId(userId, folderId);
            FolderModel[] folders = await _folderRepository.GetFoldersByFolderId(fileService, userId, folderId);
            FolderModel[] path = await _folderRepository.GetShortPath(folderId);

            return Ok(new object[] { folders, files, path });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UploadFiles([FromForm] IFormFile file, [FromForm] string? folderId, IRequestHandler requestHandler)
        {
            var idResult = requestHandler.GetUserId(Request.Headers["Authorization"]);
            Guid userId = idResult.Value == null ? Guid.Empty : Guid.Parse(idResult.Value);

            string[] nameSplit = file.FileName.Split(".");
            string name = nameSplit[0] ?? "Not set";
            string? type = nameSplit.Length >= 2 ? nameSplit[nameSplit.Length - 1] : null;

            try
            {
                await _context.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
                {
                    using (var transaction = _context.Database.BeginTransaction())
                    {
                        var fileModel = await _fileRespository.AddAsync(name, type, userId,
                            folderId == null ? Guid.Empty : Guid.Parse(folderId));

                        if (file.Length > 0 && fileModel.IsFailure == false)
                        {
                            using (var fileStream = new FileStream(fileModel.Value.Path, FileMode.Create))
                            {
                                await file.CopyToAsync(fileStream);
                            }

                            await fileModel.Value.SetPreview(_fileService);

                            await _storageHub.Clients.Group(fileModel.Value.FolderId == Guid.Empty ? fileModel.Value.OwnerId.ToString() :
                                fileModel.Value.FolderId.ToString()).SendAsync("UploadFile", fileModel.Value);
                        }

                        transaction.Commit();
                    }
                });
            }
            catch (Exception exception)
            {
                await Console.Out.WriteLineAsync(exception.Message);
                return StatusCode(500);
            }

            return Ok("Files uploaded successfully.");
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateName(Guid id, string name)
        {
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
        public async Task<IActionResult> Delete(Guid id, Guid folderId)
        {
            var result = await _fileRespository.Delete(id);

            if (result.IsFailure)
            {
                return BadRequest(result.Error);
            }

            await _storageHub.Clients.Group(folderId.ToString())
                .SendAsync("DeleteFile", id);

            return Ok();
        }
    }
}
