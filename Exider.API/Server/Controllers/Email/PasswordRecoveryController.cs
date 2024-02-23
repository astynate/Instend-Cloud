using Exider.Core.Dependencies.Repositories.Account;
using Exider.Core.Models.Account;
using Exider.Core.Models.Email;
using Exider.Dependencies.Services;
using Exider.Repositories.Email;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.Server.Controllers.Email
{

    [ApiController]
    [Route("/password-recovery")]
    public class PasswordRecoveryController : ControllerBase
    {

        private readonly IEmailService _emailService;

        private readonly IConfirmationRespository _confirmationRespository;

        private readonly IUsersRepository _usersRepository;

        public PasswordRecoveryController
        (
            IEmailService emailService, 
            IConfirmationRespository confirmationRespository, 
            IUsersRepository usersRepository
        )
        {
            _emailService = emailService;
            _confirmationRespository = confirmationRespository;
            _usersRepository = usersRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePasswordRecovery(IValidationService validationService, IEncryptionService encryptionService, string email)
        {
            if (validationService.ValidateEmail(email) == false)
                return BadRequest("Invalid email");

            UserModel? user = await _usersRepository
                .GetUserByEmailAsync(email);

            if (user is null)
                return Conflict("User not found");

            var confirmationCreationResult = ConfirmationModel
                .Create(email, encryptionService.GenerateSecretCode(6), user.Id);

            if (confirmationCreationResult.IsFailure)
                return Conflict(confirmationCreationResult.Error);

            await _confirmationRespository
                .AddAsync(confirmationCreationResult.Value);

            await _emailService.SendPasswordRecoveryEmail(email, confirmationCreationResult.Value.Code, 
                confirmationCreationResult.Value.Link.ToString());

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> RecoverPassword(IValidationService validationService, string link, string code, string password)
        {
            if (validationService.ValidateVarchar(link, code, password) == false) 
                return BadRequest("Invalid data");

            var searchConfirmationResult = await _confirmationRespository
                .GetByLinkAsync(link);

            if (searchConfirmationResult.IsFailure)
                return Conflict(searchConfirmationResult.Error);

            if (searchConfirmationResult.Value.Code != code) 
                return BadRequest("Invalid code");

            var passwordRecoverResult = await _usersRepository
                .RecoverPassword(searchConfirmationResult.Value.UserId, password);

            if (passwordRecoverResult.IsFailure)
                return BadRequest(passwordRecoverResult.Error);

            await _confirmationRespository.
                DeleteAsync(searchConfirmationResult.Value);

            return Ok();
        }

    }

}
