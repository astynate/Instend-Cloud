using Instend.Core.Dependencies.Repositories.Account;
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

        private readonly IAccountsRepository _accountsRepository;

        private readonly IPublicationsRepository _publicationsRepository;

        public NewsController
        (
            IRequestHandler requestHandler, 
            IAccountsRepository accountsRepository,
            IPublicationsRepository publicationsRepository
        )
        {
            _requestHandler = requestHandler;
            _accountsRepository = accountsRepository;
            _publicationsRepository = publicationsRepository;
        }

        [HttpGet]
        [Authorize]
        [Route("/api/news")]
        public async Task<IActionResult> GetPublictions(string? lastPublicationDate)
        {
            if (!DateTime.TryParse(lastPublicationDate, out DateTime date))
                return BadRequest("Invalid date format");

            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest(userId.Error);

            var account = await _accountsRepository
                .GetByIdAsync(Guid.Parse(userId.Value));

            if (account == null)
                return Conflict("Account not finded");

            var publications = await _publicationsRepository
                .GetNewsByAccount(date, account, 5);

            return Ok(publications);
        }
    }
}