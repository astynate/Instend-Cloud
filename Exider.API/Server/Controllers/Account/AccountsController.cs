using Exider.Core;
using Exider.Core.Dependencies.Repositories.Account;
using Exider.Core.Models.Account;
using Exider.Core.Models.Email;
using Exider.Core.TransferModels.Account;
using Exider.Dependencies.Services;
using Exider.Repositories.Account;
using Exider.Repositories.Email;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.TransferModels.Account;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.AspNetCore.Authorization;
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

        private readonly IUserDataRepository _userDataRepository;

        private readonly IImageService _imageService;

        public AccountsController
        (
            IUsersRepository users,
            IEmailRepository email,
            IConfirmationRespository confirmation,
            IUserDataRepository userDataRepository,
            IImageService imageService
        )
        {
            _usersRepository = users;
            _emailRepository = email;
            _confirmationRespository = confirmation;
            _userDataRepository = userDataRepository;
            _imageService = imageService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserDataAsync(IRequestHandler requestHandler)
        {
            var getUserId = requestHandler.GetUserId(HttpContext.Request.Headers["Authorization"].FirstOrDefault());

            if (getUserId.IsFailure)
            {
                return Unauthorized("Invalid token");
            }

            var getUserResult = await _userDataRepository.GetUserAsync(Guid.Parse(getUserId.Value));

            if (getUserResult.IsFailure)
            {
                return Unauthorized("User not found");
            }

            return Ok(getUserResult.Value);
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

            return Ok();
        }

        [HttpGet("nickname/{nickname}")]
        public async Task<IActionResult> GetAccountByNickname(string nickname)
        {
            if (string.IsNullOrEmpty(nickname))
            {
                return BadRequest("Nickname required");
            }

            UserModel? userModel = await _usersRepository.GetUserByNicknameAsync(nickname);

            if (userModel is null)
            {
                return StatusCode(470, "User not found");
            }

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateAccount([FromBody] UserTransferModel user, IEmailService emailService, IEncryptionService encryptionService)
        {

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {

                var userCreationResult = UserModel.Create
                (
                    user.name,
                    user.surname,
                    user.nickname,
                    user.email,
                    user.password
                );

                if (userCreationResult.IsFailure)
                {
                    return BadRequest(userCreationResult.Error);
                }

                await _usersRepository.AddAsync(userCreationResult.Value);

                var emailCreationResult = EmailModel.Create
                (
                    userCreationResult.Value.Email,
                    false,
                    userCreationResult.Value.Id
                );

                if (emailCreationResult.IsFailure)
                {
                    return BadRequest(emailCreationResult.Error);
                }

                await _emailRepository.AddAsync(emailCreationResult.Value);

                var confirmationCreationResult = ConfirmationModel.Create
                (
                    userCreationResult.Value.Email,
                    encryptionService.GenerateSecretCode(6),
                    userCreationResult.Value.Id
                );

                if (confirmationCreationResult.IsFailure)
                {
                    return BadRequest(confirmationCreationResult.Error);
                }

                await _confirmationRespository.AddAsync(confirmationCreationResult.Value);

                var userDataCreationResult = UserDataModel.Create(userCreationResult.Value.Id);

                if (userDataCreationResult.IsFailure)
                {
                    return BadRequest(userDataCreationResult.Error);
                }

                await _userDataRepository.AddAsync(userDataCreationResult.Value);

                await emailService.SendEmailConfirmation(userCreationResult.Value.Email, confirmationCreationResult.Value.Code,
                    Configuration.URL + "account/email/confirmation/" + confirmationCreationResult.Value.Link.ToString());

                scope.Complete();

                return Ok(confirmationCreationResult.Value.Link.ToString());

            }

        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Update([FromBody] UpdateUserDTO userDTO, IValidationService validationService, IRequestHandler requestHandler)
        {
            if (userDTO is null)
            {
                return BadRequest("Invalid user data");
            }

            if (validationService.ValidateVarchar(userDTO.name, userDTO.surname, userDTO.nickname) == false)
            {
                return BadRequest("First name, last name and nickname are required fields.");
            }

            var userId = requestHandler.GetUserId(HttpContext.Request.Headers["Authorization"].FirstOrDefault());

            if (userId.IsFailure)
            {
                return Unauthorized("Invalid token");
            }

            await _usersRepository.Update(Guid.Parse(userId.Value), userDTO.name, userDTO.surname, userDTO.nickname);

            if (string.IsNullOrEmpty(userDTO.avatar) == false && string.IsNullOrWhiteSpace(userDTO.avatar) == false)
            {
                string path = Configuration.SystemDrive + "__avatars__/" + userId;

                await _userDataRepository.UpdateAvatarAsync(Guid.Parse(userId.Value), path);
                await _imageService.UpdateAvatar(path, userDTO.avatar);
            }

            return Ok();
        }

    }

}
