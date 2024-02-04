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

        private delegate void Delegate();

        private delegate bool Check();

        [TestMethod]
        public void TestWithIncorrectValues()
        {

            Delegate SetIncorrectName = () => _user.Name = null;
            Delegate SetIncorrectSurname = () => _user.Surname = "";
            Delegate SetIncorrectNickname = () => _user.Nickname = "      ";
            Delegate SetIncorrectPassword = () => _user.Password = "jjj";

            Assert.ThrowsException<ArgumentException>
                (() => SetIncorrectName());
            Assert.ThrowsException<ArgumentException>
                (() => SetIncorrectSurname());
            Assert.ThrowsException<ArgumentException>
                (() => SetIncorrectNickname());
            Assert.ThrowsException<ArgumentException>
                (() => SetIncorrectPassword());

        }

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