using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Messenger
{
    [Table("directs")]
    public class DirectModel
    {
        [Column("id")][Key] public Guid Id { get; set; } = Guid.NewGuid();
        [Column("user_id")] public Guid UserId { get; set; }
        [Column("owner_id")] public Guid OwnerId { get; set; }
        [Column("date")] public DateTime Date { get; set; } = DateTime.Now;
        [Column("is_accepted")] public bool IsAccepted { get; set; } = false;

        [NotMapped] public string Type = "direct";

        private DirectModel() { }

        public static Result<DirectModel> Create(Guid userId, Guid ownerId)
        {
            if (userId == Guid.Empty)
            {
                return Result.Failure<DirectModel>("Invalid user id");
            }

            if (ownerId == Guid.Empty)
            {
                return Result.Failure<DirectModel>("Invalid owner id");
            }

            return new DirectModel()
            {
                UserId = userId,
                OwnerId = ownerId
            };
        }
    }
}