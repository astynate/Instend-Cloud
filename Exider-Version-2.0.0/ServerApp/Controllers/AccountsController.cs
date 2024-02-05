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

namespace Exider_Version_2._0._0.ServerApp.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class AccountsController : ControllerBase
    {
        private IUsersRepository _usersRepository { get; set; } = null!;
        private IEmailRepository _emailRepository { get; set; } = null!;
        private IConfirmationRespository _confirmationRespository { get; set; } = null!;
        private IEncryptionService _encryptionService { get; set; } = null!;
        private IEmailService _emailService { get; set; } = null!;
        private ILogger _logger { get; set; } = null!;

        [HttpGet]
        public async Task<IActionResult> GetAccount()
        {
            return Ok("!");
        }

        [HttpPost]
        public async Task<IActionResult> CreateAccount([FromBody] UserTransferModel userDTO)
        {
            try
            {

                using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {

                    UserModel user = new UserModel()
                    {
                        Name = userDTO.name, 
                        Surname = userDTO.surname,
                        Nickname = userDTO.nickname,
                        Email = userDTO.email,
                        Password = userDTO.password
                    };

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
                        Code = _encryptionService.GenerateSecretCode(6),
                        EndTime = DateTime.Now.AddHours(Configuration.confirmationLifetimeInHours),
                        UserId = user.Id
                    };

                    await _confirmationRespository.AddAsync(confirmation);

                    await _emailService.SendEmailConfirmation(user.Email, confirmation.Code,
                        Configuration.URL + "/accounts/confirmation" + confirmation.Link.ToString());

                    scope.Complete();

                }

            }

            catch (Exception exception)
            {

                _logger.LogError(exception, "An error occurred while processing the request.");
                throw;

            }

            return Ok();

        }

    }

}
