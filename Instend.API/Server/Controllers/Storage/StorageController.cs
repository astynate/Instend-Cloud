using Instend.Core;
using Instend.Services.External.FileService;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace Instend_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("api/[controller]")]
    public class StorageController : ControllerBase
    {
        private readonly IFileService _fileService;

        public StorageController(IFileService fileService)
        {
            _fileService = fileService;
        }

        private async Task<IActionResult> ReturnFilePart(string path)
        {
            if (Request.Headers.TryGetValue("Range", out var range))
            {
                var match = Regex.Match(range.First() ?? "", @"\d+");

                if (match.Success == false)
                    return NotFound();

                using (var fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    var offset = 128 * 1024;
                    var startByte = long.Parse(match.Value);
                    var endByte = startByte + offset;

                    if (startByte >= fs.Length)
                        return StatusCode(StatusCodes.Status416RangeNotSatisfiable);

                    if (endByte >= fs.Length)
                        endByte = fs.Length - 1;

                    var contentLength = endByte - startByte + 1;
                    var buffer = new byte[contentLength];

                    fs.Seek(startByte, SeekOrigin.Begin);
                    fs.Read(buffer, 0, (int)contentLength);

                    Response.StatusCode = 206;
                    Response.Headers.Add("Content-Range", $"bytes {startByte}-{endByte}/{fs.Length}");
                    Response.Headers.Add("Content-Length", contentLength.ToString());

                    await Response.Body.WriteAsync(buffer, 0, (int)contentLength);

                    return StatusCode(StatusCodes.Status206PartialContent);
                }
            }

            return NotFound();
        }

        private async Task<IActionResult> GetFile(string path)
        {
            var file = await _fileService.ReadFileAsync(path);

            if (file.IsFailure)
                return File(Convert.FromBase64String(Configuration.DefaultAvatar), "image/png");

            var splitedPath = path.Split(".");

            if (splitedPath.Length < 2)
                return BadRequest("File has not type");

            return File(file.Value, Configuration.ConvertTypeToContentType(splitedPath[splitedPath.Length - 1]));
        }

        [HttpGet]
        [Route("/api/storage/full")]
        public async Task<IActionResult> GetFileByPath(string path) => await GetFile(path);

        [HttpGet]
        [Route("/api/storage/stream")]
        public async Task<IActionResult> GetStreamByPath(string path) => await ReturnFilePart(path);
    }
}