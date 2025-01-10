using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Comments
{
    [ApiController]
    [Route("[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly IRequestHandler _requestHandler;

        private readonly FilesController _accountsRepository;

        private readonly IPublicationsRepository _publicationsRepository;

        private readonly ISerializationHelper _serializationHelper;

        public NewsController
        (
            IRequestHandler requestHandler, 
            FilesController accountsRepository,
            IPublicationsRepository publicationsRepository,
            ISerializationHelper serializationHelper
        )
        {
            _requestHandler = requestHandler;
            _accountsRepository = accountsRepository;
            _publicationsRepository = publicationsRepository;
            _serializationHelper = serializationHelper;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/news")]
        public async Task<IActionResult> GetPublictions(string? lastPublicationDate)
        {
            DateTime date;

            if (lastPublicationDate == null)
            {
                date = DateTime.Now;
            }
            else if (!DateTime.TryParse(lastPublicationDate, out date))
            {
                return BadRequest("Invalid date format");
            }

            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var account = await _accountsRepository
                .GetByIdAsync(Guid.Parse(userId.Value));

            if (account == null)
                return Conflict("Account not finded");

            var publications = await _publicationsRepository
                .GetNewsByAccount(date, [account.Id, ..account.Following.Select(f => f.AccountId)], account.Id, 5);

            return Ok(_serializationHelper.SerializeWithCamelCase(publications));
        }

        [HttpGet]
        [Authorize]
        [Route("/api/account/publications")]
        public async Task<IActionResult> GetPublictions(string? lastPublicationDate, Guid accountId)
        {
            DateTime date;

            if (lastPublicationDate == null)
            {
                date = DateTime.Now;
            }
            else if (!DateTime.TryParse(lastPublicationDate, out date))
            {
                return BadRequest("Invalid date format");
            }

            var publications = await _publicationsRepository
                .GetAccountPublications(accountId, date, 5);

            return Ok(_serializationHelper.SerializeWithCamelCase(publications));
        }
    }
}