using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Spreadsheet;
using Exider.Core;
using Exider.Core.Dependencies.Repositories.Account;
using Exider.Core.Models.Access;
using Exider.Core.Models.Account;
using Exider.Core.Models.Albums;
using Exider.Core.TransferModels;
using Exider.Repositories.Account;
using Exider.Repositories.Gallery;
using Exider.Repositories.Storage;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.TransferModels.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Access
{
    [ApiController]
    [Route("[controller]")]
    public class AlbumAccessController : ControllerBase
    {
        private readonly IAlbumRepository _albumRepository;

        private readonly IRequestHandler _requestHandler;

        private readonly IAccessRepository<AlbumAccess, AlbumModel> _albumAccess;

        public AlbumAccessController
        (
            IAlbumRepository albumRepository,
            IRequestHandler requestHandler,
            IAccessRepository<AlbumAccess, AlbumModel> albumAccess
        )
        {
            _albumRepository = albumRepository;
            _requestHandler = requestHandler;
            _albumAccess = albumAccess;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/album-access")]
        public async Task<IActionResult> GetAccess(IUserDataRepository userRepository, string? id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            {
                return Ok(new object[] { Configuration.AccessTypes.Private });
            }

            AlbumModel? album = await _albumRepository.GetByIdAsync(Guid.Parse(id));

            if (album is null)
            {
                return BadRequest("Folder not found");
            }

            var owner = await userRepository.GetUserAsync(album.OwnerId);

            if (owner.IsFailure)
            {
                return Conflict(owner.Error);
            }

            var accessResult = AccessBase.Create<AlbumAccess>(album.Id, owner.Value.Id, Configuration.Abilities.Write);

            if (accessResult.IsFailure)
            {
                return Conflict(accessResult.Error);
            }

            object ownerModel = new {
                access = accessResult.Value,
                user = owner.Value,
                base64Avatar = owner.Value.Avatar
            };

            if (album.Access == Configuration.AccessTypes.Public || album.Access == Configuration.AccessTypes.Private)
            {
                return Ok(new object[] { album.Access, ownerModel});
            }

            AccessTransferModel[] access = await _albumAccess.GetUsersWithAccess(Guid.Parse(id));

            return Ok(new object[] { album.Access, access, ownerModel });
        }

        [HttpPost]
        [Authorize]
        [Route("/api/album-access")]
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

            var executionResult = await _albumAccess
                .UpdateAccessState(type, Guid.Parse(userId.Value), Guid.Parse(id));

            if (executionResult.IsFailure)
            {
                return BadRequest(executionResult.Error);
            }

            await _albumAccess.CrearAccess(Guid.Parse(id));

            foreach (UserAccessModel user in users)
            {
                if (string.IsNullOrEmpty(user.Id) || string.IsNullOrWhiteSpace(user.Id))
                {
                    return BadRequest("Bad user id");
                }

                var result = await _albumAccess.OpenAccess(Guid.Parse(user.Id), Guid.Parse(id), user.Ability);

                if (result.IsFailure)
                {
                    return Conflict(result.Error);
                }
            }

            return Ok();
        }
    }
}