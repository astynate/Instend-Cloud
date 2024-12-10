using Instend.Core;
using Instend.Repositories.Storage;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.TransferModels.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Access
{
    [ApiController]
    [Route("[controller]")]
    public class CollectionsAccessController : ControllerBase
    {
        private readonly ICollectionsRepository _collectionsRepository;

        private readonly IRequestHandler _requestHandler;

        public CollectionsAccessController(ICollectionsRepository folderRepository, IRequestHandler requestHandler)
        {
            _collectionsRepository = folderRepository;
            _requestHandler = requestHandler;
        }

        [HttpPost]
        [Authorize]
        [Route("/collections-access")]
        public async Task<IActionResult> ChangeAccessState(string? id, Configuration.AccessTypes type, [FromBody] List<AccountAccessTransferModel> users)
        {
            throw new NotImplementedException();
            //if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
            //    return BadRequest("Invalid item id");

            //var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            //if (userId.IsFailure)
            //    return BadRequest("Invalid user id");

            //var executionResult = await _collectionsRepository.UpdateAccessState(type, Guid.Parse(userId.Value), Guid.Parse(id));

            //if (executionResult.IsFailure)
            //    return BadRequest(executionResult.Error);

            //await _collection.CreateAccessModel(Guid.Parse(id));

            //foreach (UserAccessModel user in users)
            //{
            //    if (string.IsNullOrEmpty(user.Id) || string.IsNullOrWhiteSpace(user.Id))
            //        return BadRequest("Bad user id");

            //    var result = await _folderAccess
            //        .OpenAccess(Guid.Parse(user.Id), Guid.Parse(id), user.Ability);

            //    if (result.IsFailure)
            //        return Conflict(result.Error);
            //}

            return Ok();
        }
    }
}