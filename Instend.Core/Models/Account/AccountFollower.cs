using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Account
{
    [Table("accounts_followers")]
    public class AccountFollower : DatabaseModel
    {
        [Column("account_id")] public Guid AccountId { get; private set; }
        [Column("follower_id")] public Guid FollowerId { get; private set; }
        [Column("is_submited")] public bool IsSubmited { get; private set; } = false;

        private AccountFollower() { }

        public static Result<AccountFollower> Create(Guid accountId, Guid followerId)
        {
            if (accountId == Guid.Empty || followerId == Guid.Empty)
                return Result.Failure<AccountFollower>("User not found");

            return new AccountFollower()
            {
                AccountId = accountId,
                FollowerId = followerId
            };
        }
    }
}