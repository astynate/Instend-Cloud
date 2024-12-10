using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Account
{
    [Table("accounts_sessions")]
    public class AccountSession
    {
        [Column("id")] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("device")] public string Device { get; private set; } = null!;
        [Column("browser")] public string Browser { get; private set; } = null!;
        [Column("creation_time")] public DateTime CreationTime { get; private set; }
        [Column("end_time")] public DateTime EndTime { get; private set; }
        [Column("token")] public string RefreshToken { get; private set; } = null!;
        [Column("account_id")] public Guid AccountId { get; private set; }

        private AccountSession() { }

        public static Result<AccountSession> Create(string device, string browser, string refreshToken, Guid userId)
        {
            if (string.IsNullOrEmpty(refreshToken) || string.IsNullOrWhiteSpace(refreshToken) || refreshToken.Length < 30)
                return Result.Failure<AccountSession>("Invalid refresh token value");

            if (userId == Guid.Empty)
                return Result.Failure<AccountSession>("Invalid user id");

            var sessionModel = new AccountSession()
            {
                Device = string.IsNullOrEmpty(device) ? "Indefined" : device,
                Browser = string.IsNullOrEmpty(browser) ? "Indefined" : browser,
                CreationTime = DateTime.Now,
                EndTime = DateTime.Now.AddDays(Configuration.refreshTokenLifeTimeInDays),
                RefreshToken = refreshToken,
                AccountId = userId
            };

            return Result.Success(sessionModel);
        }
    }
}