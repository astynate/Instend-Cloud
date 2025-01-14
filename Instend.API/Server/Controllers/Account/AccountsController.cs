using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.TransferModels.Account;
using Instend.Repositories.Storage;
using Instend.Services.External.FileService;
using Instend.Services.Internal.Handlers;
using Instend_Version_2._0._0.Server.TransferModels.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Dependencies.Services;
using Instend.Repositories.Contexts;
using Instend.Repositories.Publications;

namespace Instend_Version_2._0._0.Server.Controllers.Account
{
    [ApiController]
    [Route("[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IConfirmationsRepository _confirmationRepository;

        private readonly IAccountsRepository _accountsRepository;

        private readonly IImageService _imageService;

        private readonly IEmailService _emailService;

        private readonly IEncryptionService _encryptionService;

        private readonly ICollectionsRepository _collectionsRepository;

        private readonly IFileService _fileService;

        private readonly IRequestHandler _requestHandler;

        private readonly IPublicationsPhotosRepository _publicationsPhotosRepository;

        private readonly IFollowersRepository _friendsRepository;

        private readonly GlobalContext _context;

        private static readonly string[] DefaultSystemFolders = { "Instend Cloud", "Music", "Photos", "Trash" };

        public AccountsController
        (
            IConfirmationsRepository confirmationsRepository,
            IImageService imageService,
            IAccountsRepository accountsRepository,
            ICollectionsRepository folderRepository,
            IEmailService emailService,
            IEncryptionService encryptionService,
            IFollowersRepository friendsRepository,
            IPublicationsPhotosRepository publicationsPhotosRepository,
            IRequestHandler requestHandler,
            IFileService fileService,
            GlobalContext context
        )
        {
            _confirmationRepository = confirmationsRepository;
            _publicationsPhotosRepository = publicationsPhotosRepository;
            _imageService = imageService;
            _encryptionService = encryptionService;
            _accountsRepository = accountsRepository;
            _collectionsRepository = folderRepository;
            _friendsRepository = friendsRepository;
            _emailService = emailService;
            _requestHandler = requestHandler;
            _fileService = fileService;
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAccount(Guid? id)
        {
            var userId = _requestHandler
                .GetUserId(HttpContext.Request.Headers["Authorization"].FirstOrDefault());

            if (userId.IsFailure)
                return Unauthorized("Invalid token");

            var accountId = id.HasValue ? id.Value : Guid.Parse(userId.Value);
            var account = await _accountsRepository.GetByIdAsync(accountId);

            if (account == null)
                return Unauthorized("User not found");

            return Ok(account);
        }

        [Authorize]
        [HttpGet("all/{prefix}")]
        public async Task<IActionResult> GetAccountsByPrefix(string prefix)
        {
            if (string.IsNullOrEmpty(prefix))
                return BadRequest("Prefix required");

            return Ok(await _accountsRepository.GetByPrefixAsync(prefix));
        }

        [Authorize]
        [HttpGet("popular")]
        public async Task<IActionResult> GetPopuplarAccounts(int from, int count) 
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

        [Authorize]
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
        public async Task<IActionResult> CreateAccount([FromBody] UserTransferModel user)
        {
            return await _context.Database.CreateExecutionStrategy().ExecuteAsync(async Task<IActionResult> () =>
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    var account = Instend.Core.Models.Account.Account.Create
                    (
                        user.name,
                        user.surname,
                        user.nickname,
                        user.email,
                        user.password,
                        user.dateOfBirth
                    );

                    if (account.IsFailure)
                        return BadRequest(account.Error);

                    await _accountsRepository.AddAsync(account.Value);

                    var result = await CreateSystemFolders(account.Value, null);

                    if (result.IsFailure)
                        return BadRequest(result.Error);

                    var confirmation = Instend.Core.Models.Email.AccountConfirmation.Create
                    (
                        account.Value.Email,
                        _encryptionService.GenerateSecretCode(6),
                        account.Value.Id
                    );

                    if (confirmation.IsFailure)
                        return BadRequest(confirmation.Error);

                    await _confirmationRepository.AddAsync(confirmation.Value);

                    var email = account.Value.Email;
                    var code = confirmation.Value.Code;
                    var link = "account/email/confirmations/" + confirmation.Value.Link;

                    await _emailService.SendEmailConfirmation(email, code, Configuration.URL + link);

                    await transaction.CommitAsync();

                    return Ok(confirmation.Value.Link);
                }
            });
        }

        private async Task<Result> CreateSystemFolders(Instend.Core.Models.Account.Account account, string[]? systemFolders)
        {
            systemFolders ??= DefaultSystemFolders;

            foreach (var systemFolder in systemFolders)
            {
                var result = await _collectionsRepository
                    .AddAsync(systemFolder, account, Guid.Empty, Configuration.CollectionTypes.System);

                if (result.IsFailure)
                    return Result.Failure(result.Error);
            }

            return Result.Success();
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Update([FromForm] UpdateAccountTranferModel accountTransferModel)
        {
            var userId = _requestHandler
                .GetUserId(HttpContext.Request.Headers["Authorization"].FirstOrDefault());

            if (userId.IsFailure)
                return Unauthorized("Invalid token");

            var account = await _accountsRepository
                .GetByIdAsync(Guid.Parse(userId.Value));

            if (account == null)
                return Conflict("Account not found");

            await _accountsRepository.Update
            (
                Guid.Parse(userId.Value),
                account,
                accountTransferModel
            );

            if (accountTransferModel.avatar != null && accountTransferModel.avatar.Length > 0)
            {
                var avatarAsBytes = Convert
                    .FromBase64String(accountTransferModel.avatar);

                await System.IO.File
                    .WriteAllBytesAsync(account.Avatar, avatarAsBytes);
            }

            return Ok();
        }

        [HttpGet]
        [Route("/api/accounts/result")]
        public async Task<IActionResult> GetPhotos(Guid accountId, int skip) 
            => Ok(await _publicationsPhotosRepository.GetAccountPhotos(accountId, skip));
    }
}