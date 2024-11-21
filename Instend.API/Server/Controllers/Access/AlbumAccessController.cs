using Instend.Core;
using Instend.Core.Models.Access;
using Instend.Repositories.Gallery;
using Instend.Repositories.Storage;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.TransferModels.Account;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Access
{
    [ApiController]
    [Route("[controller]")]
    public class AlbumAccessController : ControllerBase
    {
        private readonly IAlbumRepository _albumRepository;

        private readonly IAccountsRepository _accountsRepository;

        private readonly IRequestHandler _requestHandler;

        private readonly IAccessRepository<AlbumAccess, AlbumModel> _albumAccess;

        public AlbumAccessController
        (
            IAlbumRepository albumRepository,
            IRequestHandler requestHandler,
            IAccountsRepository accountsRepository,
            IAccessRepository<AlbumAccess, AlbumModel> albumAccess
        )
        {
            _albumRepository = albumRepository;
            _requestHandler = requestHandler;
            _albumAccess = albumAccess;
            _accountsRepository = accountsRepository;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/album-access")]
        public async Task<IActionResult> GetAccess(Guid id)
        {
            AlbumModel? album = await _albumRepository.GetByIdAsync(id);

            if (album == null)
                return BadRequest("Folder not found");

            var owner = await _accountsRepository.GetByIdAsync(album.OwnerId);

            if (owner == null)
                return Conflict("User not found");

            var accessResult = AccessBase.Create<AlbumAccess>(album.Id, owner.Id, Configuration.Abilities.Write);

            if (accessResult.IsFailure)
                return Conflict(accessResult.Error);

            var ownerModel = new
            {
                access = accessResult.Value,
                user = owner,
                base64Avatar = owner.Avatar
            };

            if (album.Access == Configuration.AccessTypes.Public || album.Access == Configuration.AccessTypes.Private)
                return Ok(new object[] { album.Access, ownerModel});

           var access = await _albumAccess.GetUsersWithAccess(id);

            return Ok(new object[] { album.Access, access, ownerModel });
        }

        [HttpPost]
        [Authorize]
        [Route("/api/album-access")]
        public async Task<IActionResult> ChangeAccessState(string? id, Configuration.AccessTypes type, [FromBody] List<UserAccessModel> users)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Invalid item id");

            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            var executionResult = await _albumAccess
                .UpdateAccessState(type, Guid.Parse(userId.Value), Guid.Parse(id));

            if (executionResult.IsFailure)
                return BadRequest(executionResult.Error);

            await _albumAccess.CrearAccess(Guid.Parse(id));

            foreach (UserAccessModel user in users)
            {
                if (string.IsNullOrEmpty(user.Id) || string.IsNullOrWhiteSpace(user.Id))
                    return BadRequest("Bad user id");

                var result = await _albumAccess.OpenAccess(Guid.Parse(user.Id), Guid.Parse(id), user.Ability);

                if (result.IsFailure)
                    return Conflict(result.Error);
            }

            return Ok();
        }
    }
}