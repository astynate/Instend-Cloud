using Instend.Core;
using Instend.Core.Models.Access;
using Instend.Core.Models.Storage.Collection;
using Instend.Core.TransferModels.Access;
using Instend.Repositories.Storage;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.TransferModels.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Access
{
    [ApiController]
    [Route("[controller]")]
    public class FolderAccessController : ControllerBase
    {
        private readonly ICollectionsRepository _folderRepository;

        private readonly IRequestHandler _requestHandler;

        private readonly IAccessRepository<CollectionAccount, Collection> _folderAccess;

        public FolderAccessController
        (
            ICollectionsRepository folderRepository,
            IRequestHandler requestHandler,
            IAccessRepository<CollectionAccount, Collection> folderAccess
        )
        {
            _folderRepository = folderRepository;
            _requestHandler = requestHandler;
            _folderAccess = folderAccess;
        }

        [HttpGet]
        [Authorize]
        [Route("/Folders-access")]
        public async Task<IActionResult> GetAccess(Guid id)
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            var folder = await _folderRepository.GetByIdAsync(id, Guid.Parse(userId.Value));

            if (folder == null)
                return BadRequest("Folder not found");

            if (folder.Access == Configuration.AccessTypes.Public || folder.Access == Configuration.AccessTypes.Private)
                return Ok(new object[] { folder.Access });

            var access = await _folderAccess.GetUsersWithAccess(id);

            return Ok(new object[] { folder.Access, access });
        }

        [HttpPost]
        [Authorize]
        [Route("/Folders-access")]
        public async Task<IActionResult> ChangeAccessState(string? id, Configuration.AccessTypes type, [FromBody] List<UserAccessModel> users)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Invalid item id");

            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            var executionResult = await _folderAccess
                .UpdateAccessState(type, Guid.Parse(userId.Value), Guid.Parse(id));

            if (executionResult.IsFailure)
                return BadRequest(executionResult.Error);

            await _folderAccess.CreateAccessModel(Guid.Parse(id));

            foreach (UserAccessModel user in users)
            {
                if (string.IsNullOrEmpty(user.Id) || string.IsNullOrWhiteSpace(user.Id))
                    return BadRequest("Bad user id");

                var result = await _folderAccess
                    .OpenAccess(Guid.Parse(user.Id), Guid.Parse(id), user.Ability);

                if (result.IsFailure)
                    return Conflict(result.Error);
            }

            return Ok();
        }
    }
}