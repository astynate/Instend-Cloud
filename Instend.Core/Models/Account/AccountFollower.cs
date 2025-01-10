using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Account
{
    [Table("accounts_followers")]
    public class AccountFollower : DatabaseModel
    {
        [Column("account_id")] public Guid AccountId { get; private set; }
        [Column("follower_id")] public Guid FollowerId { get; private set; }

        public AccountFollower(Guid accountId, Guid followerId)
        {
            AccountId = accountId;
            FollowerId = followerId;
        }
    }
}