using Exider.Core;
using Exider.Core.Models.Account;
using Microsoft.EntityFrameworkCore;

namespace Exider.Tests.Database.Models
{

    [TestClass]
    public class TestUserModel
    {

        private static UserModel _user = new UserModel()
        {
            Name = "Test",
            Surname = "Test",
            Nickname = "Test2",
            Email = "Test2",
            Password = "123123123123123"
        };

        private static readonly DatabaseContext _context = new DatabaseContext();

        [TestMethod]
        public async Task TestSavingModel()
        {

            await Console.Out.WriteLineAsync(_user.Id.ToString());

            await _context.AddAsync(_user);
            await _context.SaveChangesAsync();

            await Console.Out.WriteLineAsync(_user.Id.ToString());

        }

        [TestMethod]
        public async Task TestGetModel()
        {

            UserModel? user = await _context
                .Users.FirstOrDefaultAsync(user => user.Nickname == "Test2");

            if (user != null) 
            {
                await Console.Out.WriteLineAsync(user.Name);
            }

        }

    }

}