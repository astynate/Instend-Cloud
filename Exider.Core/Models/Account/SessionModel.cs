using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Account
{
    public class SessionModel
    {

        [Column("id")] public Guid Id { get; private set; }

        [Column("device")] public string Device { get; private set; } = null!;

        [Column("browser")] public string Browser { get; private set; } = null!;

        [Column("creation_time")] public DateTime CreationTime { get; private set; }

        [Column("end_time")] public DateTime EndTime { get; private set; }

        [Column("token")] public string RefreshToken { get; private set; } = null!;

        [Column("user_id")] public Guid UserId { get; private set; }

        private SessionModel() { }

        public static Result<SessionModel> Create (string device, string browser, string refreshToken, Guid userId)
        {

            if (string.IsNullOrEmpty(refreshToken) || string.IsNullOrWhiteSpace(refreshToken) || refreshToken.Length < 30)
            {
                return Result.Failure<SessionModel>("Invalid refresh token value");
            }

            if (userId == Guid.Empty)
            {
                return Result.Failure<SessionModel>("Invalid user id");
            }

            SessionModel sessionModel = new SessionModel()
            {
                Device = string.IsNullOrEmpty(device) ? "Indefined" : device,
                Browser = string.IsNullOrEmpty(browser) ? "Indefined" : browser,
                CreationTime = DateTime.Now,
                EndTime = DateTime.Now.AddDays(Configuration.refreshTokenLifeTimeInDays),
                RefreshToken = refreshToken,
                UserId = userId
            };

            return Result.Success(sessionModel);

        }

    }

}
