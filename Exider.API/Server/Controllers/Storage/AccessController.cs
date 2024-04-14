using Exider.Core.Models.Storage;
using Exider.Repositories.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Storage
{
    [ApiController]
    [Route("[controller]")]
    public class AccessController : ControllerBase
    {
        private readonly IFolderRepository _folderRepository;

        private readonly IFolderAccessRepository _folderAccessRepository;

        public AccessController
        (
            IFolderRepository folderRepository,
            IFolderAccessRepository folderAccessRepository
        )
        {
            _folderAccessRepository = folderAccessRepository;
            _folderRepository = folderRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAccess(string? id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            {
                return Ok("private");
            }

            FolderModel? folder = await _folderRepository.GetByIdAsync(Guid.Parse(id));

            if (folder is null)
            {
                return BadRequest("Folder not found");
            }

            if (folder.Access == "private" || folder.Access == "public")
            {
                return Ok(folder.Access);
            }

            return Ok(await _folderAccessRepository.GetUsersWithAccess(Guid.Parse(id)));
        }
    }
}