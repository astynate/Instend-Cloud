using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Storage
{
    [Table("folder_access")]
    public class FolderAccess
    {
        [Key][Column("id")] public Guid Id { get; private set; }
        [Column("folder_id")] public Guid FolderId { get; private set; }
        [Column("user_id")] public Guid UserId { get; private set; }
        [Column("ability")] public string AbilityId { get; private set; } = Configuration.Abilities.Read.ToString();

        [EnumDataType(typeof(Configuration.Abilities))]
        [NotMapped]
        public Configuration.Abilities Ability
        {
            get => Enum.Parse<Configuration.Abilities>(AbilityId);
            set => AbilityId = value.ToString();
        }

        private FolderAccess() { }

        public static Result<FolderAccess> Create(Guid folderId, Guid userId, Configuration.Abilities ability)
        {
            if (folderId == Guid.Empty)
            {
                return Result.Failure<FolderAccess>("Invalid folder id");
            }

            if (userId == Guid.Empty)
            {
                return Result.Failure<FolderAccess>("Invalid user id");
            }

            return Result.Success(new FolderAccess()
            {
                Id = Guid.NewGuid(),
                FolderId = folderId,
                UserId = userId,
                Ability = ability
            });
        }
    }
}