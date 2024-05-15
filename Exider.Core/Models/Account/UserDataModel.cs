using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Account
{
    [Table("user_data")]
    public class UserDataModel
    {
        [Column("user_id")][Key] public Guid UserId { get; private set; }
        [Column("avatar")] public string? Avatar { get; private set; } = Configuration.DefaultAvatarPath;
        [Column("header")] public string Header { get; private set; } = string.Empty;
        [Column("description")] public string Description { get; private set; } = string.Empty;
        [Column("storage_space")] public double StorageSpace { get; private set; } = 1073741824;
        [Column("occupied_space")] public double OccupiedSpace { get; private set; } = 0;
        [Column("balance")] public decimal Balance { get; private set; } = 0;
        [Column("friend_count")] public uint FriendCount { get; private set; } = 0;

        private UserDataModel() { }

        public static Result<UserDataModel> Create(Guid userId)
        {
            if (userId == Guid.Empty)
            {
                return Result.Failure<UserDataModel>("Invalid user id");
            }

            UserDataModel userDataModel = new UserDataModel() 
            {
                UserId = userId,
            };

            return Result.Success(userDataModel);
        }

        public Result IncreaseOccupiedSpace(double amountInBytes)
        {
            if ((amountInBytes + OccupiedSpace) > StorageSpace) 
            {
                return Result.Failure("Not enough space");
            }

            if (amountInBytes > 0)
            {
                OccupiedSpace += amountInBytes;
            }

            return Result.Success();
        }

        public Result DecreaseOccupiedSpace(double amountInBytes)
        {
            if (amountInBytes > 0 && OccupiedSpace >= amountInBytes)
            {
                OccupiedSpace -= amountInBytes;
            }

            return Result.Success();
        }
    }
}