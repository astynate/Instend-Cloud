using Exider.Core.Models.Email;
using Exider.Repositories.Account;
using Exider.Repositories.Email;
using Microsoft.AspNetCore.Mvc;
using System.Transactions;

namespace Exider_Version_2._0._0.Server.Controllers.Email
{

    [ApiController]
    [Route("[controller]")]
    public class ConfirmationsController : ControllerBase
    {

        private readonly IConfirmationRespository _confirmationRespository;

        public ConfirmationsController(IConfirmationRespository confirmationRespository)
        {
            _confirmationRespository = confirmationRespository;
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

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                await _confirmationRespository.DeleteAsync(confirmation.Value);
                await emailRepository.ConfirmEmailAddressAsync(confirmation.Value.Email);

                scope.Complete();
            }

            return Ok();

        }

    }

}
