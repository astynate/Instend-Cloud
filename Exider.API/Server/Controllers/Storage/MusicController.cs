using CSharpFunctionalExtensions;
using Exider.Core.Models.Formats;
using Exider.Core.Models.Storage;
using Exider.Repositories.Storage;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("api/[controller]")]
    public class MusicController : ControllerBase
    {
        private readonly IFileRespository _fileRespository;

        private readonly IRequestHandler _requestHandler;

        private readonly IFormatRepository<SongFormat> _songFormat;

        private readonly IHubContext<StorageHub> _storageHub;

        public MusicController
        (
            IFileRespository fileRespository, 
            IRequestHandler requestHandler,
            IFormatRepository<SongFormat> songFormat,
            IHubContext<StorageHub> storageHub
        )
        {
            _fileRespository = fileRespository;
            _requestHandler = requestHandler;
            _songFormat = songFormat;
            _storageHub = storageHub;
        }

        [HttpGet]
        //[Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> BroadcastSong(string id)
        {
            //var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            //if (userId.IsFailure)
            //{
            //    return BadRequest(userId.Error);
            //}

            //if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id)) 
            //{
            //    return BadRequest("File not found");
            //}

            var fileModel = await _fileRespository.GetByIdAsync(Guid.Parse(id));

            if (fileModel.IsFailure)
            {
                return Conflict(fileModel.Error);
            }

            //Response.Headers["Content-Range"] = $"0-128/${fileModel.Value.Size}";

            //using (var stream = new FileStream(fileModel.Value.Path, FileMode.Open, FileAccess.Read, FileShare.Read, 1024))
            //{
            //    //byte[] buffer = [128];

            //    //await stream.ReadAsync(buffer);

            //    var result = File(stream, "audio/mpeg"); 

            //    //result.

            //    result.EnableRangeProcessing = true;
            //    return result;
            //}

            if (Request.Headers.TryGetValue("Range", out var range))
            {
                Match match = Regex.Match(range.First() ?? "", @"\d+");

                if (match.Success)
                {
                    using (FileStream fs = new FileStream(fileModel.Value.Path, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        long startByte = long.Parse(match.Value);
                        long endByte = startByte + 2048 * 1024;

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

        [HttpPut]
        [Microsoft.AspNetCore.Authorization.Authorize]
        [Route("/api/[controller]/song")]
        public async Task<IActionResult> UpdateSongMeta
        (
            [FromForm] IFormFile? file,
            [FromForm] Guid id,
            [FromForm] string? title,
            [FromForm] string? artist,
            [FromForm] string? album
        )
        {
            Result<(FileModel?, SongFormat?)> result = await _songFormat.GetByIdWithMetaData(id);

            if (result.IsFailure)
            {
                return Conflict("Not found");
            }

            using (var memoryStream = new MemoryStream())
            {
                if (file != null && file.Length > 0)
                {
                    await file.CopyToAsync(memoryStream);
                }
                
                result.Value.Item2.UpdateData(memoryStream.ToArray(), title, artist, album, result.Value.Item1.Type, result.Value.Item1.Path);

                await _songFormat.SaveChanges(result.Value.Item2);
                
                await _storageHub.Clients.Group(result.Value.Item1.FolderId == Guid.Empty ? result.Value.Item1.OwnerId.ToString() :
                    result.Value.Item1.Id.ToString()).SendAsync("RenameFile", 
                    new {
                        Id = result.Value.Item1.Id,
                        Name = result.Value.Item1.Name,
                        LastEditTime = result.Value.Item1.LastEditTime,
                        Access = result.Value.Item1.Access,
                        Size = result.Value.Item1.Size,
                        CoverAsBytes = result.Value.Item2.CoverAsBytes,
                        FolderId = result.Value.Item1.FolderId,
                        AccessId = result.Value.Item1.AccessId,
                        Title = result.Value.Item2.Title,
                        Artist = result.Value.Item2.Artist,
                        Album = result.Value.Item2.Album,
                        Plays = result.Value.Item2.Plays,
                        RealeseDate = result.Value.Item2.RealeseDate,
                        Genre = result.Value.Item2.Genre
                    });
            }

            return Ok();
        }
    }
}