﻿using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Comments
{
    [ApiController]
    [Route("api/publications-activity")]
    public class PublicationsActivityController : ControllerBase
    {
        private readonly IAccountsRepository _accountsRepository;

        private readonly IPublicationsRepository _publicationsRepository;

        private readonly IRequestHandler _requestHandler;

        private readonly ISerializationHelper _serializaionHelper;

        public PublicationsActivityController
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
        public async Task<IActionResult> Create(Guid publicationId, Guid reactionId)
        {
            var accountId = _requestHandler
                .GetUserId(Request.Headers["Authorization"]);

            if (accountId.IsFailure)
                return BadRequest(accountId.Error);

            var reaction = await _publicationsRepository
                .ReactAsync(publicationId, Guid.Parse(accountId.Value), reactionId);

            if (reaction.IsFailure)
                return Conflict(reaction.Error);

            if (reaction.Value == null)
                return Ok();

            return Ok(_serializaionHelper.SerializeWithCamelCase(reaction.Value));
        }

        [HttpPost]
        [Route("/api/publications-activity/comments")]
        [Authorize]
        public async Task<IActionResult> Comment([FromForm] string text, [FromForm] Guid publicationId)
        {
            if (string.IsNullOrEmpty(text) || text.Length > 1024)
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
                .CommentAsync(text, publicationId, account);

            if (publicationResult.IsFailure)
                return Conflict(publicationResult.Error);

            return Ok(publicationResult.Value);
        }
    }
}