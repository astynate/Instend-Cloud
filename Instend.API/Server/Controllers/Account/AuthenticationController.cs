using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Core.Models.Account;
using Instend.Core.Models.Email;
using Instend.Dependencies.Services;
using Instend.Repositories.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Account
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly ITokenService _tokenService;

        private readonly FilesController _accountsRepository;

        private readonly IConfirmationsRepository _confirmationRepository;

        private readonly ISessionsRepository _sessionsRepository;

        private readonly IEncryptionService _encryptionService;

        private readonly IEmailService _emailService;

        public AuthenticationController
        (
            ITokenService tokenService,
            FilesController usersRepository,
            IConfirmationsRepository emailRepository,
            IEmailService emailService,
            IEncryptionService encryptionService,
            ISessionsRepository sessionsRepository
        )
        {
            _tokenService = tokenService;
            _accountsRepository = usersRepository;
            _confirmationRepository = emailRepository;
            _sessionsRepository = sessionsRepository;
            _encryptionService = encryptionService;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAuthenticationState(string accessToken)
        {
            var refreshToken = Request.Cookies["system_refresh_token"]?.ToString();

            if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
                return Unauthorized();

            var userId = Guid.Parse(_tokenService.GetUserIdFromToken(accessToken) ?? "");

            if (_tokenService.IsTokenValid(accessToken) == false || userId == Guid.Empty)
                return Unauthorized();

            if (_tokenService.IsTokenAlive(accessToken) == true)
                return Ok(accessToken);

            var sessionModel = await _sessionsRepository
                .GetSessionByTokenAndUserId(userId, refreshToken);

            if (sessionModel == null || sessionModel.EndTime <= DateTime.Now)
                return Unauthorized();

            accessToken = _tokenService.GenerateAccessToken(userId.ToString(),
                Configuration.accessTokenLifeTimeInMinutes, Configuration.TestEncryptionKey);

            return Ok(accessToken);
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromForm] string username, [FromForm] string password)
        {
            var account = await _accountsRepository.GetByEmailOrNicknameAsync(username);

            if (account == null)
                return BadRequest("User not found");

            if (account.IsConfirmed == false)
            {
                var confirmation = AccountConfirmation
                    .Create(account.Email, _encryptionService.GenerateSecretCode(6), account.Id);

                if (confirmation.IsFailure)
                    return BadRequest(confirmation.Error);

                await _confirmationRepository.AddAsync(confirmation.Value);

                await _emailService.SendEmailConfirmation(confirmation.Value.Email,
                    confirmation.Value.Code, confirmation.Value.Link.ToString());

                return StatusCode(470, confirmation.Value.Link.ToString());
            }

            if (account.Password != _encryptionService.HashUsingSHA256(password))
                return StatusCode(StatusCodes.Status401Unauthorized);

            string accessToken = _tokenService
                .GenerateAccessToken(account.Id.ToString(), 30, Configuration.TestEncryptionKey);

            string refreshToken = _tokenService
                .GenerateRefreshToken(account.Id.ToString());

            var sessionCreationResult = AccountSession.Create
            (
                "",
                "",
                refreshToken,
                account.Id
            );

            if (sessionCreationResult.IsFailure)
                return BadRequest(sessionCreationResult.Error);

            await _sessionsRepository.AddSessionAsync(sessionCreationResult.Value);
            await _emailService.SendLoginNotificationEmail(account.Email, sessionCreationResult.Value);

            Response.Cookies.Append("system_refresh_token", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                MaxAge = TimeSpan.FromDays(Configuration.refreshTokenLifeTimeInDays)
            });

            return Ok(accessToken);
        }
    }
}