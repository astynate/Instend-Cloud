using Exider_Version_2._0._0.ServerApp.Dependencies;
using Exider_Version_2._0._0.ServerApp.Models;
using Exider_Version_2._0._0.ServerApp.TransferObjects;
using Microsoft.AspNetCore.Mvc;

namespace Exider_Version_2._0._0.ServerApp.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class AccountsController : ControllerBase
    {

        private readonly IUsersRepository _usersRepository;

        public AccountsController(IUsersRepository usersRepository)
        {
            _usersRepository = usersRepository;
        }

        [HttpPost]
        public async Task<ActionResult> CreateAccount([FromBody] UserTransferModel userTransferModel)
        {

            try
            {

                UserModel user = new UserModel(userTransferModel);

                if (user == null)
                {
                    throw new ArgumentException(nameof(user));
                }

                await _usersRepository.AddAsync(user);

            }

            catch (Exception exception)
            {

                return BadRequest(exception.Message);

            }

            return Ok();

        }

    }

}
