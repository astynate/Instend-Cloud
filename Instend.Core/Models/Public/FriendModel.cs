using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Public
{
    [Table("friends")]
    public class FriendModel
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("user_id")] public Guid UserId { get; private set; }
        [Column("owner_id")] public Guid OwnerId { get; private set; }
        [Column("is_submited")] public bool IsSubmited { get; private set; } = false;

        private FriendModel() { }

        public static Result<FriendModel> Create(Guid userId, Guid ownerId)
        {
            if (userId == Guid.Empty || ownerId == Guid.Empty)
            {
                return Result.Failure<FriendModel>("User not found");
            }

            return new FriendModel() 
            {
                UserId = userId,
                OwnerId = ownerId
            };
        }
    }
}