using Exider.Core;
using Exider.Core.Models.Storage;
using Exider.Core.TransferModels;
using Exider.Repositories.Storage;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.TransferModels.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

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
                return Ok(new object[] { Configuration.AccessTypes.Private });
            }

            FolderModel? folder = await _folderRepository.GetByIdAsync(Guid.Parse(id));

            if (folder is null)
            {
                return BadRequest("Folder not found");
            }

            if (folder.Access == Configuration.AccessTypes.Public || folder.Access == Configuration.AccessTypes.Private)
            {
                return Ok(new object[] { folder.Access });
            }

            AccessTransferModel[] access = await _folderAccessRepository.GetUsersWithAccess(Guid.Parse(id));
            return Ok(new object[] { folder.Access, access });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ChangeAccessState(string? id, Configuration.AccessTypes type, [FromBody] List<UserAccessModel> users)
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

            var executionResult = await _folderAccessRepository
                .UpdateAccessState(type, Guid.Parse(userId.Value), Guid.Parse(id));

            if (executionResult.IsFailure)
            {
                return BadRequest(executionResult.Error);
            }

            await _folderAccessRepository.CrearAccess(Guid.Parse(id));

            foreach (UserAccessModel user in users) 
            {
                if (string.IsNullOrEmpty(user.Id) || string.IsNullOrWhiteSpace(user.Id))
                {
                    return BadRequest("Bad user id");
                }

                var result = await _folderAccessRepository.OpenAccess(Guid.Parse(user.Id), Guid.Parse(id), user.Ability);

                if (result.IsFailure)
                {
                    return Conflict(result.Error);
                }
            }

            return Ok();
        }
    }
}