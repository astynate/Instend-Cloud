using Instend.Core;
using Instend.Repositories.Gallery;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.TransferModels.Account;
using Instend.Core.Dependencies.Repositories.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Access
{
    [ApiController]
    [Route("[controller]")]
    public class AlbumAccessController : ControllerBase
    {
        private readonly IAlbumsRepository _albumRepository;

        private readonly IAccountsRepository _accountsRepository;

        private readonly IRequestHandler _requestHandler;

        public AlbumAccessController
        (
            IAlbumsRepository albumRepository,
            IRequestHandler requestHandler,
            IAccountsRepository accountsRepository
        )
        {
            _albumRepository = albumRepository;
            _requestHandler = requestHandler;
            _accountsRepository = accountsRepository;
        }

        [HttpPost]
        [Authorize]
        [Route("/api/album-access")]
        public async Task<IActionResult> ChangeAccessState(Guid id, Configuration.AccessTypes type, [FromBody] List<AccountAccessTransferModel> users)
        {
            throw new NotImplementedException();
        }
    }
}