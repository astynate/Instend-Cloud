using Exider.Core;
using Exider.Core.Models;
using Exider.Repositories.Repositories;

namespace Exider.Tests.Database.Repositories
{

    [TestClass]
    public class TestSessionRepository
    {

        private SessionsRepository _sessionRepository = null!;

        //[TestMethod]
        //public async Task TestSessionCreation()
        //{

        //    DatabaseContext db = new DatabaseContext();

        //    _sessionRepository = new SessionsRepository(db);

        //    for (int i = 0; i < 10; i++)
        //    {

        //        SessionModel session = new SessionModel()
        //        {
        //            _device = "Test",
        //            _browser = "Test",
        //            _location = "Test",
        //            _ipAddress = "Test",
        //            _creationTime = DateTime.Now,
        //            _endTime = DateTime.Now.AddDays(30),
        //            _refreshToken = "gkgg-bkbjgjh123-bhjgfjj-123",
        //            _userId = 10
        //        };

        //        await _sessionRepository.AddSessionAsync(session);

        //    }

        //}

    }

}
