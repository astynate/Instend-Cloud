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
        public async Task<IActionResult> Create([FromForm] PublicationTransferModel publication)
        {
            if (string.IsNullOrEmpty(publication.text) || publication.text.Length > 1024)
                return BadRequest("Text of your publcation must not be empthy and contains up to 1024 symbols.");

            var accountId = _requestHandler
                .GetUserId(Request.Headers["Authorization"]);

            if (accountId.IsFailure)
                return BadRequest(accountId.Error);

            var account = await _accountsRepository
                .GetByIdAsync(Guid.Parse(accountId.Value));

            if (account == null)
                return Conflict("Account not found");

            var publicationResult = await _publicationsRepository
                .AddAsync(publication, account);

            if (publicationResult.IsFailure)
                return Conflict(publicationResult.Error);

            return Ok(new {publication = publicationResult.Value});
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Edit([FromForm] UpdatePublicationTransferModel publication)
        {
            if (string.IsNullOrEmpty(publication.text) || publication.text.Length > 1024)
                return BadRequest("Text of your publcation must not be empthy and contains up to 1024 symbols.");

            var accountId = _requestHandler
                .GetUserId(Request.Headers["Authorization"]);

            if (accountId.IsFailure)
                return BadRequest(accountId.Error);

            var account = await _accountsRepository
                .GetByIdAsync(Guid.Parse(accountId.Value));

            if (account == null)
                return Conflict("Account not found");

            var publicationResult = await _publicationsRepository
                .UpdateAsync(publication, account);

            if (publicationResult.IsFailure)
                return Conflict(publicationResult.Error);

            return Ok(_serializaionHelper.SerializeWithCamelCase(publicationResult.Value));
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var accountId = _requestHandler
                .GetUserId(Request.Headers["Authorization"]);

            if (accountId.IsFailure)
                return BadRequest(accountId.Error);

            var account = await _accountsRepository
                .GetByIdAsync(Guid.Parse(accountId.Value));

            if (account == null)
                return Conflict("Account not found");

            var publicationResult = await _publicationsRepository
                .DeleteAsync(id, account.Id);

            if (publicationResult == false)
                return Conflict("Publication not found.");

            return Ok();
        }
    }
}