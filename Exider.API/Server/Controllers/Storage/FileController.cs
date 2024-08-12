using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Dependencies.Repositories.Storage;
using Exider.Core.Models.Links;
using Exider.Core.Models.Messenger;
using Exider.Core.Models.Storage;
using Exider.Repositories.Comments;
using Exider.Repositories.Storage;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using static Exider.Core.Models.Links.AlbumLinks;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;

        private readonly IAccessHandler _accessHandler;

        private readonly IFileRespository _fileRepository;

        private readonly ICommentsRepository<AlbumCommentLink, AttachmentCommentLink> _commentsRepository;

        private readonly ICommentsRepository<ComminityPublicationLink, AttachmentCommentLink> _publicationRepository;

        private readonly ICommentsRepository<UserPublicationLink, AttachmentCommentLink> _userPublicationRepository;

        private readonly IAttachmentsRepository<MessageAttachmentLink> _messageAttachmentRepository;

        private readonly IRequestHandler _requestHandler;

        public FileController
        (
            IFileService fileService,
            IFileRespository fileRespository,
            IAccessHandler accessHandler,
            IRequestHandler requestHandler,
            ICommentsRepository<AlbumCommentLink, AttachmentCommentLink> commentsRepository,
            ICommentsRepository<ComminityPublicationLink, AttachmentCommentLink> publicationRepository,
            ICommentsRepository<UserPublicationLink, AttachmentCommentLink> userPublicationRepository,
            IAttachmentsRepository<MessageAttachmentLink> messageAttachmentRepository
        )
        {
            _fileService = fileService;
            _accessHandler = accessHandler;
            _fileRepository = fileRespository;
            _requestHandler = requestHandler;
            _commentsRepository = commentsRepository;
            _publicationRepository = publicationRepository;
            _userPublicationRepository = userPublicationRepository;
            _messageAttachmentRepository = messageAttachmentRepository;
        }

        private async Task<IActionResult> ReturnFilePart(string path)
        {
            if (Request.Headers.TryGetValue("Range", out var range))
            {
                Match match = Regex.Match(range.First() ?? "", @"\d+");

                if (match.Success)
                {
                    using (FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        int offset = 128 * 1024;

                        long startByte = long.Parse(match.Value);
                        long endByte = startByte + offset;

                        if (startByte >= fs.Length)
                        {
                            return StatusCode(StatusCodes.Status416RangeNotSatisfiable);
                        }

                        if (endByte >= fs.Length)
                        {
                            endByte = fs.Length - 1;
                        }

                        long contentLength = endByte - startByte + 1;
                        byte[] buffer = new byte[contentLength];

                        fs.Seek(startByte, SeekOrigin.Begin);
                        fs.Read(buffer, 0, (int)contentLength);

                        Response.StatusCode = 206;
                        Response.Headers.Add("Content-Range", $"bytes {startByte}-{endByte}/{fs.Length}");
                        Response.Headers.Add("Content-Length", contentLength.ToString());

                        await Response.Body.WriteAsync(buffer, 0, (int)contentLength);

                        return StatusCode(StatusCodes.Status206PartialContent);
                    }
                }
            }

            return NotFound();
        }

        private async Task<IActionResult> GetFile(string path)
        {
            var file = await _fileService.ReadFileAsync(path);

            if (file.IsFailure)
            {
                return Conflict(file.Error);
            }

            return Ok(file.Value);
        }

        private async Task<Result<AttachmentModel>> GetAttachment(string? publictionId, string? id, int type)
        {
            if (string.IsNullOrEmpty(publictionId) || string.IsNullOrWhiteSpace(publictionId))
            {
                return Result.Failure<AttachmentModel>("Attachment not found");
            }

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            {
                return Result.Failure<AttachmentModel>("Attachment not found");
            }

            Dictionary<int, Configuration.GetAttachmentDelegate> handlers = new Dictionary<int, Configuration.GetAttachmentDelegate>
            {
                { 0, _publicationRepository.GetAttachmentAsync },
                { 1, _commentsRepository.GetAttachmentAsync },
                { 2, _userPublicationRepository.GetAttachmentAsync },
                { 3, _messageAttachmentRepository.GetAttachmentAsync }
            };

            if (handlers.ContainsKey(type) == false)
            {
                return Result.Failure<AttachmentModel>("Invalid type");
            }

            return await handlers[type](Guid.Parse(publictionId), Guid.Parse(id));
        }

        [HttpGet]
        [Authorize]
        [Route("/api/files/full")]
        public async Task<IActionResult> GetFullFileFromStorage(string? id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Invalid file id");
            }

            var fileModel = await _fileRepository.GetByIdAsync(Guid.Parse(id));

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

            return await GetFile(fileModel.Value.Path);
        }

        [HttpGet]
        [Authorize]
        [Route("/api/publictions/full")]
        public async Task<IActionResult> GetFullFileFromPubliction(string? publictionId, string? id, int type)
        {
            var result = await GetAttachment(publictionId, id, type);

            if (result.IsFailure)
            {
                return Conflict("Attachment not found");
            }

            return await GetFile(result.Value.Path);
        }

        [HttpGet]
        [Route("/api/files/stream")]
        public async Task<IActionResult> GetFilePartFromStorage(string id, string token)
        {
            var userId = _requestHandler.GetUserId("Bearer " + token);

            if (userId.IsFailure)
            {
                return BadRequest(userId.Error);
            }

            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("File not found");
            }

            var fileModel = await _fileRepository.GetByIdAsync(Guid.Parse(id));

            if (fileModel.IsFailure)
            {
                return Conflict(fileModel.Error);
            }

            return await ReturnFilePart(fileModel.Value.Path);
        }

        [HttpGet]
        [Route("/api/publictions/stream")]
        public async Task<IActionResult> GetFilePartFromStorage(string? publictionId, string? id, int type)
        {
            var result = await GetAttachment(publictionId, id, type);

            if (result.IsFailure)
            {
                return Conflict("Attachment not found");
            }

            return await ReturnFilePart(result.Value.Path);
        }
    }
}