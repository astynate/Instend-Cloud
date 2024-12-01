using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Account
{
    [Table("friends")]
    public class AccountFollower : DatabaseModel
    {
        [Column("user_id")] public Guid AccountModelId { get; private set; }
        [Column("owner_id")] public Guid OwnerId { get; private set; }
        [Column("is_submited")] public bool IsSubmited { get; private set; } = false;

        private AccountFollower() { }

        public static Result<AccountFollower> Create(Guid userId, Guid ownerId)
        {
            if (userId == Guid.Empty || ownerId == Guid.Empty)
                return Result.Failure<AccountFollower>("User not found");

            return new AccountFollower()
            {
                AccountModelId = userId,
                OwnerId = ownerId
            };
        }
    }
}