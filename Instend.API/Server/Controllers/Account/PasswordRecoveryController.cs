using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Core.Models.Account;
using Instend.Core.Models.Email;
using Instend.Dependencies.Services;
using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers.Account
{
    [ApiController]
    [Route("/password-recovery")]
    public class PasswordRecoveryController : ControllerBase
    {
        private readonly IEmailService _emailService;

        private readonly IConfirmationsRepository _confirmationRespository;

        private readonly IAccountsRepository _accountsRepository;

        public PasswordRecoveryController
        (
            IEmailService emailService,
            IConfirmationsRepository confirmationRespository,
            IAccountsRepository usersRepository
        )
        {
            _emailService = emailService;
            _confirmationRespository = confirmationRespository;
            _accountsRepository = usersRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePasswordRecovery(IValidationService validationService, IEncryptionService encryptionService, string email)
        {
            if (validationService.ValidateEmail(email) == false)
                return BadRequest("Invalid email");

            Core.Models.Account.Account? user = await _accountsRepository
                .GetByEmailAsync(email);

            if (user is null)
                return Conflict("User not found");

            var confirmationCreationResult = AccountConfirmation
                .Create(email, encryptionService.GenerateSecretCode(6), user.Id);

            if (confirmationCreationResult.IsFailure)
                return Conflict(confirmationCreationResult.Error);

            await _confirmationRespository
                .AddAsync(confirmationCreationResult.Value);

            await _emailService.SendPasswordRecoveryEmail(email, confirmationCreationResult.Value.Code,
                confirmationCreationResult.Value.Link.ToString());

            return Ok(confirmationCreationResult.Value.Link.ToString());
        }

        [HttpPut]
        public async Task<IActionResult> RecoverPassword(IValidationService validationService, Guid link, string code, string password)
        {
            if (validationService.ValidateVarchar(code, password) == false)
                return BadRequest("Invalid data");

            var searchConfirmationResult = await _confirmationRespository
                .GetByLinkAsync(link);

            if (searchConfirmationResult.IsFailure)
                return Conflict(searchConfirmationResult.Error);

            if (searchConfirmationResult.Value.Code != code)
                return BadRequest("Invalid code");

            var passwordRecoverResult = await _accountsRepository
                .RecoverPassword(searchConfirmationResult.Value.UserId, password);

            if (passwordRecoverResult.IsFailure)
                return BadRequest(passwordRecoverResult.Error);

            await _confirmationRespository.
                DeleteAsync(searchConfirmationResult.Value);

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> RecoverConfirmation(Guid link, string code)
        {
            var confirmation = await _confirmationRespository.GetByLinkAsync(link);

            if (confirmation.IsFailure)
                return BadRequest(confirmation.Error);

            if (confirmation.Value.Code != code)
                return BadRequest("Incorrect code");

            return Ok();
        }
    }
}
