using Exider.Core.TransferModels.Account;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.ServerApp.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class AccountsController : ControllerBase
    {

        [HttpPost]
        public async Task<ActionResult> CreateAccount([FromBody] UserTransferModel userTransferModel)
        {

            try
            {

                //UserModel user = new UserModel(userTransferModel);

                //if (user == null)
                //{
                //    throw new ArgumentException(nameof(user));
                //}

                //await _usersRepository.AddAsync(user);

            }

            catch (Exception exception)
            {

                return BadRequest(exception.Message);

            }

            return Ok();

        }

    }

}
