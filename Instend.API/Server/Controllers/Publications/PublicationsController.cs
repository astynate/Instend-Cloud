using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Repositories.Publications;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Comments
{
    [ApiController]
    [Route("api/[controller]")]
    public class PublicationsController : ControllerBase
    {
        private readonly IAccountsRepository _accountsRepository;

        private readonly IPublicationsRepository _publicationsRepository;

        private readonly IRequestHandler _requestHandler;

        private readonly ISerializationHelper _serializaionHelper;

        public PublicationsController
        (
            IPublicationsRepository publicationsRepository, 
            IRequestHandler requestHandler,
            IAccountsRepository accountsRepository,
            ISerializationHelper serializaionHelper
        )
        {
            _publicationsRepository = publicationsRepository;
            _requestHandler = requestHandler;
            _accountsRepository = accountsRepository;
            _serializaionHelper = serializaionHelper;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromForm] PublicationTransferModel transferModel)
        {
            if (string.IsNullOrEmpty(transferModel.text) || transferModel.text.Length > 1024)
                return BadRequest("Text of your publcation must not be empthy and contains up to 1024 symbols.");

            var accountId = _requestHandler
                .GetUserId(Request.Headers["Authorization"]);

            if (accountId.IsFailure)
                return BadRequest(accountId.Error);

            var account = await _accountsRepository
                .GetByIdAsync(Guid.Parse(accountId.Value));

            if (account == null)
                return Conflict("Account not found");

            var publication = await _publicationsRepository
                .AddAsync(transferModel, account);

            if (publication.IsFailure)
                return Conflict(publication.Error);

            return Ok(publication.Value);
        }
    }
}