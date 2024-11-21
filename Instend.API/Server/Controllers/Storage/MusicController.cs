using CSharpFunctionalExtensions;
using Instend.Core.Models.Formats;
using Instend.Core.Models.Storage;
using Instend.Repositories.Storage;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace Instend_Version_2._0._0.Server.Controllers.Storage
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