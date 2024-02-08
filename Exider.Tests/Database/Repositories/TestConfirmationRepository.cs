using Exider.Core;
using Exider.Core.Models.Email;
using Exider.Repositories.Email;
using Exider_Version_2._0._0.ServerApp.Services;

namespace Exider.Tests.Database.Repositories
{

    [TestClass]
    public class TestConfirmationRepository
    {

        private readonly ConfirmationRespository _confirmationRespository = 
            new ConfirmationRespository(new DatabaseContext(), new ValidationService());

        private readonly string _userId = "08dc2634-a0f4-4459-8b73-4c583cac5946";

        [TestMethod]
        public async Task TestAddAsyncWithCorrectValues()
        {

            ConfirmationModel confirmation = new ConfirmationModel()
            {

                Email = "test@email.com",
                Code = "RESDFR",
                EndTime = DateTime.Now.AddHours(7),
                UserId = Guid.Parse(_userId)

            };

            await _confirmationRespository.AddAsync(confirmation);

        }
        [TestMethod]
        public async Task TestAddAsyncWhenEntityExist()
        {

            ConfirmationModel confirmation = new ConfirmationModel()
            {

                Email = "test@email.com",
                Code = "FFFFFF",
                EndTime = DateTime.Now.AddHours(7),
                UserId = Guid.Parse(_userId)

            };

            await _confirmationRespository.AddAsync(confirmation);

        }


    }

}
