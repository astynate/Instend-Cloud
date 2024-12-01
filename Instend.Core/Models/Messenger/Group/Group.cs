using CSharpFunctionalExtensions;
using Instend.Core.Models.Account;
using Instend.Core.Models.Messenger.Message;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Messenger.Group
{
    [Table("groups")]
    public class Group
    {
        [Column("id")] public Guid Id { get; private set; }
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("avatar_path")] public string AvatarPath { get; private set; } = string.Empty;
        [Column("date")] public DateTime Date { get; private set; } = DateTime.Now;
        [Column("number_of_participants")] public int NumberOfParticipants { get; private set; } = 1;
        [Column("owner_id")] public Guid OwnerId { get; private set; }

        [NotMapped] public byte[] Avatar { get; set; } = [];
        [NotMapped] public string Type { get; set; } = "group";

        public List<Account.Account> Members { get; set; } = [];
        public List<Message.Message> Messages { get; set; } = [];

        private Group() { }

        public static Result<Group> Create(string name, Guid ownerId)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
                return Result.Failure<Group>("Invalid name");

            if (name.Length > 30)
                return Result.Failure<Group>("The name can contain a maximum of 30 letters.");

            var id = Guid.NewGuid();
            var avatarPath = Configuration.GetAvailableDrivePath() + id.ToString();

            return new Group()
            {
                Id = id,
                Name = name,
                AvatarPath = avatarPath,
                OwnerId = ownerId
            };
        }
    }
}