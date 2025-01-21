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

        private readonly IRequestHandler _requestHandler;

        public AccessController(ICollectionsRepository folderRepository, IRequestHandler requestHandler)
        {
            _collectionsRepository = folderRepository;
            _requestHandler = requestHandler;
        }

        [HttpPost]
        [Authorize]
        [Route("/api/access/collections")]
        public async Task<IActionResult> ChangeAccessState([FromForm] Guid id, [FromForm] Configuration.AccessTypes type, [FromForm] List<CollectionAccount> users)
        {
            

            return Ok();
        }
    }
}