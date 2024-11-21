using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Core.Models.Account;
using Instend.Core.Models.Email;
using Instend.Core.TransferModels.Account;
using Instend.Dependencies.Services;
using Instend.Repositories.Account;
using Instend.Repositories.Storage;
using Instend.Services.External.FileService;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.TransferModels.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Instend_Version_2._0._0.Server.Controllers.Account
{
    [ApiController]
    [Route("[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IConfirmationsRespository _confirmationRepository;

        private readonly IAccountsRepository _accountsRepository;

        private readonly IImageService _imageService;

        private readonly IFolderRepository _folderRepository;

        private readonly IFriendsRepository _friendsRepository;

        private readonly DatabaseContext _context;

        public AccountsController
        (
            IConfirmationsRespository confirmation,
            IImageService imageService,
            IAccountsRepository accountsRepository,
            IFolderRepository folderRepository,
            IFriendsRepository friendsRepository,
            DatabaseContext context
        )
        {
            _confirmationRepository = confirmation;
            _imageService = imageService;
            _accountsRepository = accountsRepository;
            _folderRepository = folderRepository;
            _friendsRepository = friendsRepository;
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserDataAsync(IRequestHandler requestHandler)
        {
            var userId = requestHandler.GetUserId(HttpContext.Request.Headers["Authorization"].FirstOrDefault());

            if (userId.IsFailure)
                return Unauthorized("Invalid token");

            var account = await _accountsRepository.GetByIdAsync(Guid.Parse(userId.Value));

            if (account == null)
                return Unauthorized("User not found");

            var friends = await _friendsRepository
                .GetFriendsByUserId(Guid.Parse(userId.Value));

            return Ok(new object[] { account, friends });
        }

        [Authorize]
        [HttpGet("all/{prefix}")]
        public async Task<IActionResult> GetUsersByPrefixAsync(string prefix)
        {
            if (string.IsNullOrEmpty(prefix))
                return BadRequest("Prefix required");

            return Ok(await _accountsRepository.GetByPrefixAsync(prefix));
        }

        [Authorize]
        [HttpGet("popular")]
        public async Task<IActionResult> GetUsersByPrefixAsync(int from, int count) 
            => Ok(await _accountsRepository.GetPopuplarPeopleAsync(from, count));

        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetAccountByEmail(string email)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrWhiteSpace(email))
                return BadRequest("Confirmations required");

            var account = await _accountsRepository.GetByEmailAsync(email);

            if (account == null)
                return StatusCode(470, "User not found");

            return Ok();
        }

        [HttpGet("id/{id}")]
        public async Task<IActionResult> GetAccountById(string id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Confirmations required");

            var account = await _accountsRepository.GetByIdAsync(Guid.Parse(id));

            if (account == null)
                return StatusCode(470, "User not found");

            return Ok(account);
        }

        [HttpGet("nickname/{nickname}")]
        public async Task<IActionResult> GetAccountByNickname(string nickname)
        {
            if (string.IsNullOrEmpty(nickname) || string.IsNullOrWhiteSpace(nickname))
                return BadRequest("Nickname required");

            var account = await _accountsRepository.GetByNicknameAsync(nickname);

            if (account == null)
                return StatusCode(470, "User not found");

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateAccount
        (
            [FromBody] UserTransferModel user, 
            IEmailService emailService, 
            IEncryptionService encryptionService
        )
        {
            return await _context.Database.CreateExecutionStrategy().ExecuteAsync(async Task<IActionResult> () =>
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    //var userCreationResult = AccountModel.Create
                    //(
                    //    user.name,
                    //    user.surname,
                    //    user.nickname,
                    //    user.email,
                    //    user.password
                    //);

                    //if (userCreationResult.IsFailure)
                    //    return BadRequest(userCreationResult.Error);

                    //await _usersRepository.AddAsync(userCreationResult.Value);

                    //var emailCreationResult = ConfirmationModel.Create
                    //(
                    //    userCreationResult.Value.Email,
                    //    false,
                    //    userCreationResult.Value.Id
                    //);

                    //if (emailCreationResult.IsFailure)
                    //    return BadRequest(emailCreationResult.Error);

                    //await _emailRepository.AddAsync(emailCreationResult.Value);

                    //var confirmationCreationResult = Instend.Core.Models.Email.ConfirmationModel.Create
                    //(
                    //    userCreationResult.Value.Email,
                    //    encryptionService.GenerateSecretCode(6),
                    //    userCreationResult.Value.Id
                    //);

                    //if (confirmationCreationResult.IsFailure)
                    //    return BadRequest(confirmationCreationResult.Error);

                    //await _confirmationRepository.AddAsync(confirmationCreationResult.Value);

                    //var userDataCreationResult = UserDataModel.Create(userCreationResult.Value.Id);

                    //if (userDataCreationResult.IsFailure)
                    //    return BadRequest(userDataCreationResult.Error);

                    //await _userDataRepository.AddAsync(userDataCreationResult.Value);

                    //await emailService.SendEmailConfirmation(userCreationResult.Value.Email, confirmationCreationResult.Value.Code,
                    //    Configuration.URL + "account/email/confirmation/" + confirmationCreationResult.Value.Link.ToString());

                    //var systemResult = await CreateSystemFolders(userCreationResult.Value.Id);

                    //if (systemResult.IsFailure)
                    //    return Conflict(systemResult.Error);

                    transaction.Commit();

                    return Ok(); // confirmationCreationResult.Value.Link.ToString()
                }
            });
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Update([FromForm] UpdateUserDTO userDTO, IRequestHandler requestHandler)
        {
            //if (userDTO is null)
            //    return BadRequest("Invalid user data");

            //if (string.IsNullOrEmpty(userDTO.name) || string.IsNullOrEmpty(userDTO.surname) || string.IsNullOrEmpty(userDTO.nickname))
            //    return BadRequest("First name, last name and nickname are required fields.");

            //var userId = requestHandler.GetUserId(HttpContext.Request.Headers["Authorization"].FirstOrDefault());

            //if (userId.IsFailure)
            //    return Unauthorized("Invalid token");

            //await _usersRepository.Update(Guid.Parse(userId.Value), userDTO.name, userDTO.surname, userDTO.nickname);

            //if (userDTO.avatar == "delete")
            //{
            //    var deleteResult = await _imageService.DeleteAvatar
            //    (
            //        _userDataRepository, 
            //        Guid.Parse(userId.Value), 
            //        Configuration.DefaultAvatarPath
            //    );

            //    if (deleteResult.IsFailure)
            //    {
            //        return Conflict(deleteResult.Error);
            //    }
            //}

            //else if (userDTO.avatar != null && userDTO.avatar.Length > 0)
            //{
            //    var updateResult = await _imageService.UpdateAvatar
            //    (
            //        _userDataRepository, 
            //        Guid.Parse(userId.Value), 
            //        Configuration.GetAvailableDrivePath() + userId.Value + "a", userDTO.avatar
            //    );

            //    if (updateResult.IsFailure)
            //    {
            //        return Conflict(updateResult.Error);
            //    }
            //}

            //if (userDTO.header == "delete")
            //{
            //    var deleteResult = await _imageService.DeleteHeader
            //    (
            //        _userDataRepository,
            //        Guid.Parse(userId.Value),
            //        Configuration.GetAvailableDrivePath() + userId.Value + "h"
            //    );

            //    if (deleteResult.IsFailure)
            //    {
            //        return Conflict(deleteResult.Error);
            //    }
            //}

            //else if (userDTO.header != null && userDTO.header.Length > 0)
            //{
            //    var updateResult = await _imageService.UpdateHeader
            //    (
            //        _userDataRepository, 
            //        Guid.Parse(userId.Value), 
            //        Configuration.GetAvailableDrivePath() + userId.Value + "h", userDTO.header
            //    );

            //    if (updateResult.IsFailure)
            //    {
            //        return Conflict(updateResult.Error);
            //    }
            //}

            return Ok();
        }

        public async Task<Result> CreateSystemFolders(Guid userId)
        {
            string[] systemFolders = ["Music", "Photos", "Trash"];

            foreach (string systemFolder in systemFolders)
            {
                var photos = await _folderRepository.AddAsync(systemFolder, userId, Guid.Empty, Configuration.FolderTypes.System, false);

                if (photos.IsFailure)
                {
                    return Result.Failure(photos.Error);
                }
            }

            return Result.Success();
        }
    }
}