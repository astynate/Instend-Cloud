using Instend.Core.Models.Account;
using Instend.Repositories.Account;
using Instend.Repositories.Contexts;
using Instend_Version_2._0._0.ServerApp.Services;
using System.Transactions;

namespace Instend.Tests.Database.Repositories
{

    [TestClass]
    public class TestEmailRepository
    {
        [TestMethod]
        public void EmailCreationWithCorrectConditions()
        {

            //using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            //{

            //    UserModel user = new UserModel()
            //    {
            //        Name = "Test",
            //        Surname = "Test",
            //        Nickname = "Test2",
            //        Email = "test@email.com",
            //        Password = "123123123123123"
            //    };

            //    await _context.AddAsync(user);
            //    await _context.SaveChangesAsync();

            //    EmailModel emailModel = new EmailModel()
            //    {
            //        Email = user.Email,
            //        IsConfirmed = false,
            //        CreationTime = DateTime.Now,
            //        UserId = user.Id,
            //    };

            //    await _emailRepository.AddAsync(emailModel);

            //    scope.Complete();

            //}

        }

    }

}
