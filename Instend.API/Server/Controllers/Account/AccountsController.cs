using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Dependencies.Repositories.Account;
using Exider.Core.Models.Account;
using Exider.Core.Models.Email;
using Exider.Core.TransferModels.Account;
using Exider.Dependencies.Services;
using Exider.Repositories.Account;
using Exider.Repositories.Email;
using Exider.Repositories.Public;
using Exider.Repositories.Storage;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Exider_Version_2._0._0.Server.TransferModels.Account;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Exider_Version_2._0._0.Server.Controllers.Account
{
    [ApiController]
    [Route("[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository;

        private readonly IEmailRepository _emailRepository;

        private readonly IConfirmationRespository _confirmationRepository;

        private readonly ICommunityRepository _communityRepository;

        private readonly IUserDataRepository _userDataRepository;

        private readonly IImageService _imageService;

        private readonly IFolderRepository _folderRepository;

        private readonly IFriendsRepository _friendsRepository;

        private readonly DatabaseContext _context;

        public AccountsController
        (
            IUsersRepository users,
            IEmailRepository email,
            IConfirmationRespository confirmation,
            IUserDataRepository userDataRepository,
            IImageService imageService,
            IFolderRepository folderRepository,
            IFriendsRepository friendsRepository,
            ICommunityRepository communityRepository,
            DatabaseContext context
        )
        {
            _usersRepository = users;
            _emailRepository = email;
            _confirmationRepository = confirmation;
            _userDataRepository = userDataRepository;
            _imageService = imageService;
            _folderRepository = folderRepository;
            _friendsRepository = friendsRepository;
            _context = context;
            _communityRepository = communityRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserDataAsync(IRequestHandler requestHandler)
        {
            var userId = requestHandler.GetUserId(HttpContext.Request.Headers["Authorization"].FirstOrDefault());

            if (userId.IsFailure)
                return Unauthorized("Invalid token");

            var getUserResult = await _userDataRepository.GetUserAsync(Guid.Parse(userId.Value));

            if (getUserResult.IsFailure)
                return Unauthorized("User not found");

            var friends = await _friendsRepository
                .GetFriendsByUserId(Guid.Parse(userId.Value));

            var communities = await _communityRepository.GetFollowingIds(Guid.Parse(userId.Value));

            return Ok(new object[] { getUserResult.Value, friends, communities.Value });
        }

        [Authorize]
        [HttpGet("all/{prefix}")]
        public async Task<IActionResult> GetUsersByPrefixAsync(string prefix)
        {
            if (string.IsNullOrEmpty(prefix))
                return BadRequest("Prefix required");

            UserPublic[] users = await _userDataRepository.GetUsersByPrefixAsync(prefix);

            if (users == null)
                return Conflict("User not found");

            return Ok(users);
        }

        [Authorize]
        [HttpGet("popular")]
        public async Task<IActionResult> GetUsersByPrefixAsync()
        {
            UserPublic[] users = await _userDataRepository.GetPopularPeople();

            if (users == null)
                return Conflict("User not found");

            return Ok(users);
        }

        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetAccountByEmail(string email)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrWhiteSpace(email))
                return BadRequest("Email required");

            UserModel? userModel = await _usersRepository.GetUserByEmailAsync(email);

            if (userModel == null)
                return StatusCode(470, "User not found");

            return Ok();
        }

        [HttpGet("id/{id}")]
        public async Task<IActionResult> GetAccountById(string id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest("Email required");

            var userModel = await _userDataRepository.GetUserAsync(Guid.Parse(id));

            if (userModel.IsFailure)
                return StatusCode(470, "User not found");

            return Ok(userModel.Value);
        }

        [HttpGet("nickname/{nickname}")]
        public async Task<IActionResult> GetAccountByNickname(string nickname)
        {
            if (string.IsNullOrEmpty(nickname) || string.IsNullOrWhiteSpace(nickname))
                return BadRequest("Nickname required");

            UserModel? userModel = await _usersRepository.GetUserByNicknameAsync(nickname);

            if (userModel == null)
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
                    var userCreationResult = UserModel.Create
                    (
                        user.name,
                        user.surname,
                        user.nickname,
                        user.email,
                        user.password
                    );

                    if (userCreationResult.IsFailure)
                        return BadRequest(userCreationResult.Error);

                    await _usersRepository.AddAsync(userCreationResult.Value);

                    var emailCreationResult = EmailModel.Create
                    (
                        userCreationResult.Value.Email,
                        false,
                        userCreationResult.Value.Id
                    );

                    if (emailCreationResult.IsFailure)
                        return BadRequest(emailCreationResult.Error);

                    await _emailRepository.AddAsync(emailCreationResult.Value);

                    var confirmationCreationResult = ConfirmationModel.Create
                    (
                        userCreationResult.Value.Email,
                        encryptionService.GenerateSecretCode(6),
                        userCreationResult.Value.Id
                    );

                    if (confirmationCreationResult.IsFailure)
                        return BadRequest(confirmationCreationResult.Error);

                    await _confirmationRepository.AddAsync(confirmationCreationResult.Value);

                    var userDataCreationResult = UserDataModel.Create(userCreationResult.Value.Id);

                    if (userDataCreationResult.IsFailure)
                        return BadRequest(userDataCreationResult.Error);

                    await _userDataRepository.AddAsync(userDataCreationResult.Value);

                    await emailService.SendEmailConfirmation(userCreationResult.Value.Email, confirmationCreationResult.Value.Code,
                        Configuration.URL + "account/email/confirmation/" + confirmationCreationResult.Value.Link.ToString());

                    var systemResult = await CreateSystemFolders(userCreationResult.Value.Id);

                    if (systemResult.IsFailure)
                        return Conflict(systemResult.Error);

                    transaction.Commit();

                    return Ok(confirmationCreationResult.Value.Link.ToString());
                }
            });
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Update([FromForm] UpdateUserDTO userDTO, IRequestHandler requestHandler)
        {
            if (userDTO is null)
                return BadRequest("Invalid user data");

            if (string.IsNullOrEmpty(userDTO.name) || string.IsNullOrEmpty(userDTO.surname) || string.IsNullOrEmpty(userDTO.nickname))
                return BadRequest("First name, last name and nickname are required fields.");

            var userId = requestHandler.GetUserId(HttpContext.Request.Headers["Authorization"].FirstOrDefault());

            if (userId.IsFailure)
                return Unauthorized("Invalid token");

            await _usersRepository.Update(Guid.Parse(userId.Value), userDTO.name, userDTO.surname, userDTO.nickname);

            if (userDTO.avatar == "delete")
            {
                var deleteResult = await _imageService.DeleteAvatar
                (
                    _userDataRepository, 
                    Guid.Parse(userId.Value), 
                    Configuration.DefaultAvatarPath
                );

                if (deleteResult.IsFailure)
                {
                    return Conflict(deleteResult.Error);
                }
            }

            else if (userDTO.avatar != null && userDTO.avatar.Length > 0)
            {
                var updateResult = await _imageService.UpdateAvatar
                (
                    _userDataRepository, 
                    Guid.Parse(userId.Value), 
                    Configuration.GetAvailableDrivePath() + userId.Value + "a", userDTO.avatar
                );

                if (updateResult.IsFailure)
                {
                    return Conflict(updateResult.Error);
                }
            }

            if (userDTO.header == "delete")
            {
                var deleteResult = await _imageService.DeleteHeader
                (
                    _userDataRepository,
                    Guid.Parse(userId.Value),
                    Configuration.GetAvailableDrivePath() + userId.Value + "h"
                );

                if (deleteResult.IsFailure)
                {
                    return Conflict(deleteResult.Error);
                }
            }

            else if (userDTO.header != null && userDTO.header.Length > 0)
            {
                var updateResult = await _imageService.UpdateHeader
                (
                    _userDataRepository, 
                    Guid.Parse(userId.Value), 
                    Configuration.GetAvailableDrivePath() + userId.Value + "h", userDTO.header
                );

                if (updateResult.IsFailure)
                {
                    return Conflict(updateResult.Error);
                }
            }

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