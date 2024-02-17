using Exider.Core;
using Exider.Core.Dependencies.Repositories.Account;
using Exider.Core.Models.Account;
using Exider.Dependencies.Services;
using Exider.Repositories.Account;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Account
{

    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {

        private readonly ITokenService _tokenService;

        private readonly IUsersRepository _usersRepository;

        private readonly IEmailRepository _emailRepository;

        public AuthenticationController(ITokenService tokenService, IUsersRepository usersRepository, IEmailRepository emailRepository)
        {
            _tokenService = tokenService;
            _usersRepository = usersRepository;
            _emailRepository = emailRepository;
        }

        [HttpPost]
        public async Task<ActionResult> Login(IEncryptionService encryptionService)
        {

            if (string.IsNullOrEmpty(Request.Form["email"]))
            {
                return BadRequest("Email cannot be empthy");
            }

            if (string.IsNullOrEmpty(Request.Form["password"]))
            {
                return BadRequest("Password cannot be empthy");
            }

            UserModel? user = await _usersRepository.GetUserByEmailAsync(Request.Form["email"]);

            if (user is null)
            {
                return BadRequest("User not found");
            }

            var getEmailResult = await _emailRepository.GetByEmailAsync(Request.Form["email"]);

            if (getEmailResult.IsFailure)
            {
                return Conflict(getEmailResult.Error);
            }

            if (user.Email == Request.Form["email"] && user.Password == encryptionService.HashUsingSHA256(Request.Form["password"]))
            {
                string accessToken = _tokenService.GenerateAccessToken(user.Id.ToString(), 30, Configuration.testEncryptionKey);
                string refreshToken = _tokenService.GenerateRefreshToken(user.Id.ToString());

                return Ok(new string[] { accessToken, refreshToken, Request.HttpContext.Connection.RemoteIpAddress.ToString() });
            }

            return StatusCode(StatusCodes.Status401Unauthorized);

        }

    }
}
