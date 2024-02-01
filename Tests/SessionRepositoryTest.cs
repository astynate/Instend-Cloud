using Exider_Version_2._0._0.ServerApp.Configuration;
using Exider_Version_2._0._0.ServerApp.Models;
using Exider_Version_2._0._0.ServerApp.Repositories;

namespace Tests
{

    [TestClass]
    public class SessionRepositoryTest
    {

        private SessionRepository _sessionRepository = null!;

        [TestMethod]
        public async Task TestSessionCreation()
        {

            using (DatabaseContext db = new DatabaseContext())
            {

                _sessionRepository = new SessionRepository(db);

                for (int i = 0; i < 10; i++)
                {

                    SessionModel session = new SessionModel()
                    {
                        _device = "Test",
                        _browser = "Test",
                        _location = "Test",
                        _ipAddress = "Test",
                        _creationTime = DateTime.Now,
                        _endTime = DateTime.Now.AddDays(30),
                        _refreshToken = "gkgg-bkbjgjh123-bhjgfjj-123",
                        _userId = 10
                    };

                    await _sessionRepository.AddSessionAsync(session);

                }

            }

        }

    }

}
