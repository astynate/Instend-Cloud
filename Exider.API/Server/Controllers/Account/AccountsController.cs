using Exider.Core;
using Exider.Core.Dependencies.Repositories.Account;
using Exider.Core.Models.Account;
using Exider.Core.Models.Email;
using Exider.Core.TransferModels.Account;
using Exider.Dependencies.Services;
using Exider.Repositories.Account;
using Exider.Repositories.Email;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.AspNetCore.Mvc;
using System.Transactions;

namespace Exider_Version_2._0._0.Server.Controllers.Account
{

    [ApiController]
    [Route("[controller]")]
    public class AccountsController : ControllerBase
    {

        private readonly IUsersRepository _usersRepository;

        private readonly IEmailRepository _emailRepository;

        private readonly IConfirmationRespository _confirmationRespository;

        public AccountsController(IUsersRepository users, IEmailRepository email, IConfirmationRespository confirmation)
        {
            _usersRepository = users;
            _emailRepository = email;
            _confirmationRespository = confirmation;
        }

        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetAccountByEmail(string email)
        {

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email required");
            }

            UserModel? userModel = await _usersRepository.GetUserByEmailAsync(email);

            if (userModel is null)
            {
                return StatusCode(470, "User not found");
            }

            return Ok(new PublicUserModel(userModel));

        }

        [HttpGet("nickname/{nickname}")]
        public async Task<IActionResult> GetAccountByNickname(string nickname)
        {

            if (string.IsNullOrEmpty(nickname))
            {
                return BadRequest("Nickname required");
            }

            UserModel? userModel = await _usersRepository.GetUserByEmailAsync(nickname);

            if (userModel is null)
            {
                return StatusCode(470, "User not found");
            }

            return Ok(new PublicUserModel(userModel));

        }

        [HttpPost]
        public async Task<IActionResult> CreateAccount([FromBody] UserModel user, IEmailService emailService, IEncryptionService encryptionService)
        {

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {

                await _usersRepository.AddAsync(user);

                EmailModel email = new EmailModel()
                {
                    Email = user.Email,
                    CreationTime = DateTime.Now,
                    IsConfirmed = false,
                    UserId = user.Id
                };

                await _emailRepository.AddAsync(email);

                ConfirmationModel confirmation = new ConfirmationModel()
                {
                    Email = user.Email,
                    Code = encryptionService.GenerateSecretCode(6),
                    EndTime = DateTime.Now.AddHours(Configuration.confirmationLifetimeInHours),
                    UserId = user.Id
                };

                await _confirmationRespository.AddAsync(confirmation);

                await emailService.SendEmailConfirmation(user.Email, confirmation.Code,
                    Configuration.URL + "account/email/confirmation/" + confirmation.Link.ToString());

                scope.Complete();

                return Ok(confirmation.Link.ToString());

            }

        }

    }

}
