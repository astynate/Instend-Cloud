using Instend.Core.Models.Account;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Tests.Database.Models
{

    [TestClass]
    public class TestUserModel
    {

        private static Account _user = Account.Create("Test", "Test", "Test", "sicome.a.s23123@gmail.com", "asdas").Value;

        private static readonly AccountsContext _context = new AccountsContext();

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

            Account? user = await _context
                .Accounts.FirstOrDefaultAsync(user => user.Nickname == "Test2");

            if (user != null) 
            {
                await Console.Out.WriteLineAsync(user.Name);
            }

        }

    }

}