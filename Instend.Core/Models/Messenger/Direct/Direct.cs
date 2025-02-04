using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Messenger.Direct
{
    [Table("directs")]
    public class Direct : DatabaseModel
    {
        [Column("account_id")] public Guid AccountId { get; set; }
        [Column("owner_id")] public Guid OwnerId { get; set; }
        [Column("date")] public DateTime Date { get; set; } = DateTime.Now;
        [Column("is_accepted")]  public bool IsAccepted { get; set; } = false;

        [NotMapped] public string Type { get; init; } = "direct";

        public List<Message.Message> Messages { get; init; } = [];
        public Account.Account? Account { get; init; } = null;
        public Account.Account? Owner { get; init; } = null;

        private Direct() { }

        public static Result<Direct> Create(Guid userId, Guid ownerId)
        {
            if (userId == Guid.Empty)
                return Result.Failure<Direct>("Invalid user id");

            if (ownerId == Guid.Empty)
                return Result.Failure<Direct>("Invalid owner id");

            return new Direct()
            {
                AccountId = userId,
                OwnerId = ownerId
            };
        }
    }
}