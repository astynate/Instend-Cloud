using Exider.Core;
using Exider.Core.Models.Storage;
using Exider.Repositories.Storage;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.TransferModels.Account;
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

        private readonly IRequestHandler _requestHandler;

        public AccessController
        (
            IFolderRepository folderRepository,
            IFolderAccessRepository folderAccessRepository,
            IRequestHandler requestHandler
        )
        {
            _folderAccessRepository = folderAccessRepository;
            _folderRepository = folderRepository;
            _requestHandler = requestHandler;
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

            if (folder.Access == Configuration.AccessTypes.Public || folder.Access == Configuration.AccessTypes.Private)
            {
                return Ok(folder.Access);
            }

            return Ok(await _folderAccessRepository.GetUsersWithAccess(Guid.Parse(id)));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ChangeAccessState([FromForm] string? id, [FromForm] Configuration.AccessTypes type, [FromForm] UserAccessModel[] users)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Invalid item id");
            }

            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
            {
                return BadRequest("Invalid user id");
            }

            //if (type >= 0 && type <= 2)
            //{
            //    return BadRequest("Invalid type");
            //}

            var executionResult = await _folderAccessRepository
                .UpdateAccessState(type, Guid.Parse(userId.Value), Guid.Parse(id));


            if (Configuration.AccessTypes.Public == 0)
            {

            }

            return Ok(new object[] { id, type, users});
        }
    }
}