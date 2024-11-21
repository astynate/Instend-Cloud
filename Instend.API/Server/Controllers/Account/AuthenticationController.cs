using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Core.Models.Account;
using Instend.Core.Models.Email;
using Instend.Dependencies.Services;
using Instend.Repositories.Account;
using Instend.Repositories.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Account
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly ITokenService _tokenService;

        private readonly IAccountsRepository _accountsRepository;

        private readonly IConfirmationsRepository _confirmationRepository;

        private readonly IEmailService _emailService;

        public AuthenticationController
        (
            ITokenService tokenService,
            IAccountsRepository usersRepository,
            IConfirmationsRepository emailRepository,
            IEmailService emailService
        )
        {
            _tokenService = tokenService;
            _accountsRepository = usersRepository;
            _confirmationRepository = emailRepository;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAuthenticationState(ISessionsRepository sessionsRepository, string accessToken)
        {
            var refreshToken = Request.Cookies["system_refresh_token"]?.ToString();

            if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
                return Unauthorized();

            var userId = Guid.Parse(_tokenService.GetUserIdFromToken(accessToken) ?? "");

            if (_tokenService.IsTokenValid(accessToken) == false || userId == Guid.Empty)
                return Unauthorized();

            if (_tokenService.IsTokenAlive(accessToken) == true)
                return Ok(accessToken);

            var sessionModel = await sessionsRepository
                .GetSessionByTokenAndUserId(userId, refreshToken);

            if (sessionModel == null || sessionModel.EndTime <= DateTime.Now)
                return Unauthorized();

            accessToken = _tokenService.GenerateAccessToken(userId.ToString(),
                Configuration.accessTokenLifeTimeInMinutes, Configuration.TestEncryptionKey);

            return Ok(accessToken);
        }

        [HttpPost]
        public async Task<IActionResult> Login(IEncryptionService encryptionService, ISessionsRepository sessionsRepository, IConfirmationsRespository confirmationRespository)
        {
            var username = Request.Form["username"];
            var password = Request.Form["password"];

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return BadRequest("Ivalid form data");

            var user = await _accountsRepository.GetByEmailOrNicknameAsync(username);

            if (user is null)
                return BadRequest("User not found");

            var account = await _accountsRepository.GetByEmailAsync(user.Email);

            if (account == null)
                return Conflict("User not found");

            if (account.IsConfirmed == false)
            {
                var confirmationCreationResult = ConfirmationModel
                    .Create(account.Email, encryptionService.GenerateSecretCode(6), account.Id);

                if (confirmationCreationResult.IsFailure)
                    return BadRequest(confirmationCreationResult.Error);

                await confirmationRespository.AddAsync(confirmationCreationResult.Value);

                await _emailService.SendEmailConfirmation(confirmationCreationResult.Value.Email,
                    confirmationCreationResult.Value.Code, confirmationCreationResult.Value.Link.ToString());

                return StatusCode(470, confirmationCreationResult.Value.Link.ToString());
            }

            if (user.Password != encryptionService.HashUsingSHA256(password))
                return StatusCode(StatusCodes.Status401Unauthorized);

            string accessToken = _tokenService
                .GenerateAccessToken(user.Id.ToString(), 30, Configuration.TestEncryptionKey);

            string refreshToken = _tokenService
                .GenerateRefreshToken(user.Id.ToString());

            var sessionCreationResult = SessionModel.Create
            (
                "",
                "",
                refreshToken,
                user.Id
            );

            if (sessionCreationResult.IsFailure)
                return BadRequest(sessionCreationResult.Error);

            await sessionsRepository.AddSessionAsync(sessionCreationResult.Value);
            await _emailService.SendLoginNotificationEmail(user.Email, sessionCreationResult.Value);

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