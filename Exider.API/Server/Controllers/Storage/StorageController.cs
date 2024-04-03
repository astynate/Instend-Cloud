using Exider.Core.Models.Storage;
using Exider.Dependencies.Services;
using Exider.Repositories.Storage;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("[controller]")]
    public class StorageController : ControllerBase
    {
        private readonly ITokenService _tokenService;

        private readonly IFileRespository _fileRespository;

        private readonly IFolderRepository _folderRepository;

        public StorageController
        (
            ITokenService tokenService,
            IFileRespository fileRespository,
            IFolderRepository folderRepository
        )
        {
            _tokenService = tokenService;
            _fileRespository = fileRespository;
            _folderRepository = folderRepository;
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
        public async Task<ActionResult> GetFiles(IRequestHandler requestHandler, string? id)
        {
            var idGettingResult = requestHandler.GetUserId(Request.Headers["Authorization"]);

            Guid userId = Guid.Parse(idGettingResult.Value);
            Guid folderId = id == null ? Guid.Empty : Guid.Parse(id);

            FileModel[] files = await _fileRespository.GetByFolderId(userId, folderId);
            FolderModel[] folders = await _folderRepository.GetByFolderId(userId, folderId);

            return Ok(new object[] { folders, files });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UploadFiles([FromForm] IFormFile file, string? folderId, IRequestHandler requestHandler)
        {
            var idResult = requestHandler.GetUserId(Request.Headers["Authorization"]);
            Guid userId = idResult.Value == null ? Guid.Empty : Guid.Parse(idResult.Value);

            string[] nameSplit = file.FileName.Split(".");
            string name = nameSplit[0] ?? "Not set";
            string? type = nameSplit.Length >= 2 ? nameSplit[nameSplit.Length - 1] : null;

            var fileModel = await _fileRespository.AddAsync(name, type, userId,
                folderId == null ? Guid.Empty : Guid.Parse(folderId));

            if (file.Length <= 0 || fileModel.IsFailure)
            {
                return BadRequest("Uploaded files should not be empty.");
            }

            using (var fileStream = new FileStream(fileModel.Value.Path, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
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

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _fileRespository.Delete(id);

            if (result.IsFailure)
            {
                return BadRequest(result.Error);
            }

            return Ok();
        }
    }
}
