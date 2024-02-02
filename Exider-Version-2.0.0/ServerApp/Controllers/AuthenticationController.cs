using Exider.Core;
using Exider.Core.Models;
using Exider.Dependencies.Repositories;
using Exider.Dependencies.Services;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.ServerApp.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {

        private readonly IUsersRepository _usersRepository;

        private readonly ITokenService _tokenService;

        public AuthenticationController(IUsersRepository usersRepository, ITokenService tokenService)
        {
            _usersRepository = usersRepository;
            _tokenService = tokenService;
        }

        [HttpGet]
        public async Task<ActionResult> Login(string email, string password)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                    throw new ArgumentException(nameof(email));

                if (string.IsNullOrEmpty(password))
                    throw new ArgumentException(nameof(password));

                UserModel user = await _usersRepository.GetUserByEmail(email); 

                if (user is null)
                {
                    throw new ArgumentException(nameof(user));
                }

                if (user.Email == email && user.Password == EncryptionService.HashUsingSHA256(password))
                {
                    string accessToken = _tokenService.GenerateAccessToken(user.PublicId, 30, Configuration.testEncryptionKey);
                    string refreshToken = _tokenService.GenerateRefreshToken(user.PublicId);

                    return Ok(new string[] { accessToken, refreshToken });
                }

                return StatusCode(StatusCodes.Status401Unauthorized);

            }

            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }

        }

    }
}
