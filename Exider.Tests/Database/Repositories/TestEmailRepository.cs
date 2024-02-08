using Exider.Core;
using Exider.Core.Models.Account;
using Exider.Repositories.Account;
using Exider_Version_2._0._0.ServerApp.Services;
using System.Transactions;

namespace Exider.Tests.Database.Repositories
{

    [TestClass]
    public class TestEmailRepository
    {

        private readonly static DatabaseContext _context = new DatabaseContext();

        private readonly static IEmailRepository _emailRepository = 
            new EmailRepository(_context, new ValidationService());

        [TestMethod]
        public async Task EmailCreationWithCorrectConditions()
        {

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {

                UserModel user = new UserModel()
                {
                    Name = "Test",
                    Surname = "Test",
                    Nickname = "Test2",
                    Email = "test@email.com",
                    Password = "123123123123123"
                };

                await _context.AddAsync(user);
                await _context.SaveChangesAsync();

                EmailModel emailModel = new EmailModel()
                {
                    Email = user.Email,
                    IsConfirmed = false,
                    CreationTime = DateTime.Now,
                    UserId = user.Id,
                };

                await _emailRepository.AddAsync(emailModel);

                scope.Complete();

            }

        }

    }

}
