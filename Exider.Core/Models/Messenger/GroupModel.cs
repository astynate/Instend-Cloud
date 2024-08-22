using CSharpFunctionalExtensions;
using Exider.Core.TransferModels.Account;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Messenger
{
    [Table("groups")]
    public class GroupModel
    {
        [Column("id")] public Guid Id { get; private set; }
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("avatar_path")] public string AvatarPath { get; private set; } = string.Empty;
        [Column("date")] public DateTime Date { get; private set; } = DateTime.Now;
        [Column("number_of_participants")] public int NumberOfParticipants { get; private set; } = 1;
        [Column("owner_id")] public Guid OwnerId { get; private set; }

        [NotMapped] public UserPublic[] Members { get; set; } = new UserPublic[0];
        [NotMapped] public byte[] Avatar { get; set; } = new byte[0];
        [NotMapped] public string Type { get; set; } = "group";

        private GroupModel() { }

        public static Result<GroupModel> Create(string name, Guid ownerId)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
            {
                return Result.Failure<GroupModel>("Invalid name");
            }

            if (name.Length > 30)
            {
                return Result.Failure<GroupModel>("The name can contain a maximum of 30 letters.");
            }

            Guid id = Guid.NewGuid();
            
            return new GroupModel()
            {
                Id = id,
                Name = name,
                AvatarPath = Configuration.SystemDrive + "__group__/" + id.ToString(),
                OwnerId = ownerId
            };
        }
    }
}