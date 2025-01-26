using Instend.Core;
using Instend.Core.Models.Storage.Collection;
using Instend.Repositories.Storage;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Access
{
    [ApiController]
    [Route("[controller]")]
    public class AccessController : ControllerBase
    {
        private readonly ICollectionsRepository _collectionsRepository;

        private readonly IAccessRepository _accessRepository;

        private readonly IRequestHandler _requestHandler;

        public AccessController(ICollectionsRepository collectionsRepository, IAccessRepository accessRepository, IRequestHandler requestHandler)
        {
            _collectionsRepository = collectionsRepository;
            _accessRepository = accessRepository;
            _requestHandler = requestHandler;
        }

        [HttpPost]
        [Authorize]
        [Route("/api/access/collections")]
        public async Task<IActionResult> ChangeAccessState([FromForm] Guid id, [FromForm] Configuration.AccessTypes type, [FromForm] List<CollectionAccount> users)
        {
            var accountId = _requestHandler
                .GetUserId(Request.Headers["Authorization"]);

            if (accountId.IsFailure)
                return BadRequest("Invalid user id");

            var collection = await _collectionsRepository.GetByIdAsync(id);

            if (collection == null)
                return Conflict("Collection not found.");

            var result = await _accessRepository.ChangeAccess<Collection, CollectionAccount>
            (
                collection.AccountsWithAccess, 
                users, 
                collection, 
                type, 
                Guid.Parse(accountId.Value)
            );

            if (result.IsFailure)
                return Conflict(result.Error);

            return Ok();
        }
    }
}