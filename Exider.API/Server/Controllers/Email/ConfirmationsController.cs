using Exider.Core;
using Exider.Dependencies.Services;
using Exider.Repositories.Account;
using Exider.Repositories.Email;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Exider_Version_2._0._0.Server.Controllers.Email
{

    [ApiController]
    [Route("[controller]")]
    public class ConfirmationsController : ControllerBase
    {
        private readonly IConfirmationRespository _confirmationRespository;

        private readonly DatabaseContext _context;

        public ConfirmationsController(DatabaseContext context, IConfirmationRespository confirmationRespository)
        {
            _confirmationRespository = confirmationRespository;
            _context = context;
        }

        [HttpGet("link/{link}")]
        public async Task<IActionResult> GetConfirmationByLink(string link)
        {

            var confirmation = await _confirmationRespository.GetByLinkAsync(link);

            if (confirmation.IsFailure)
            {
                return BadRequest(confirmation.Error);
            }

            return Ok(confirmation.Value.Email);

        }

        [HttpPost]
        public async Task<IActionResult> ConfirmEmailAddress(IEmailRepository emailRepository, string link, string code)
        {
            var confirmation = await _confirmationRespository.GetByLinkAsync(link);

            if (confirmation.IsFailure)
                return BadRequest(confirmation.Error);

            if (confirmation.Value.Code != code)
                return BadRequest("Incorrect code");

            try
            {
                await _context.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
                {
                    using (var transaction = await _context.Database.BeginTransactionAsync())
                    {
                        await _confirmationRespository.DeleteAsync(confirmation.Value);
                        await emailRepository.ConfirmEmailAddressAsync(confirmation.Value.Email);

                        transaction.Commit();
                    }
                });
            }
            catch
            {
                return BadRequest();
            }

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> ResendConfirmation(IEmailService emailService, IEncryptionService encryptionService, string link)
        {
            if (string.IsNullOrEmpty(link))
                return BadRequest("Invalid link");

            var confirmationUpdateResult = await _confirmationRespository
                .UpdateByLinkAsync(encryptionService, link);

            if (confirmationUpdateResult.IsFailure)
                return Conflict(confirmationUpdateResult.Error);

            await emailService.SendEmailConfirmation(confirmationUpdateResult.Value.Email, confirmationUpdateResult.Value.Code,
                confirmationUpdateResult.Value.Link.ToString());

            return Ok();
        }
    }
}
