using Exider_Version_2._0._0.ServerApp.Models;

namespace Tests
{
    [TestClass]
    public class UserEncapsulation
    {

        private static UserModel? _user = new UserModel()
        {
            Name = "Test",
            Surname = "Test",
            Nickname = "Test",
            Password = "Test",
            Email = "sicome.a.s@gmail.com",
        };

        private delegate void UserDelegate();

        private delegate bool Check();

        [TestMethod]
        public void TestEmpthyFields()
        {

            UserDelegate SetNullableName = () => _user.Name = null;
            UserDelegate SetNullableSurname = () => _user.Surname = "";
            UserDelegate SetNullableNickname = () => _user.Nickname = "      ";
            UserDelegate SetNullablePassword = () => _user.Password = "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj";

            Assert.ThrowsException<ArgumentNullException>
                (() => SetNullableName());
            //Assert.ThrowsException<ArgumentNullException>
            //    (() => SetNullableSurname());
            //Assert.ThrowsException<ArgumentNullException>
            //    (() => SetNullableNickname());
            //Assert.ThrowsException<ArgumentNullException>
            //    (() => SetNullablePassword());

        }

        [TestMethod]
        public void TestEmailPattern()
        {

            Check EmailPattern = () =>
            {

                _user.Email = "zixe.company@gmail.com";
                return _user.Email == "zixe.company@gmail.com";

            };

            Assert.ThrowsException<ArgumentException>
                (() => _user.Email = "sicomeasdadads");

            Assert.IsTrue(EmailPattern());

        }

    }
}