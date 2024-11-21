using Instend.Core;
using Instend.Core.Models.Account;
using Microsoft.EntityFrameworkCore;

namespace Instend.Tests.Database.Models
{

    [TestClass]
    public class TestUserModel
    {

        private static AccountModel _user = AccountModel.Create("Test", "Test", "Test", "sicome.a.s23123@gmail.com", "asdas").Value;

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

            AccountModel? user = await _context
                .Accounts.FirstOrDefaultAsync(user => user.Nickname == "Test2");

            if (user != null) 
            {
                await Console.Out.WriteLineAsync(user.Name);
            }

        }

    }

}