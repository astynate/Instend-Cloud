using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Abstraction
{
    public class AccessBase
    {
        [Key][Column("id")] public Guid Id { get; protected set; }
        [Column("item_id")] public Guid ItemId { get; protected set; }
        [Column("user_id")] public Guid UserId { get; protected set; }
        [Column("ability")] public string AbilityId { get; protected set; } = Configuration.Abilities.Read.ToString();

        [NotMapped]
        [EnumDataType(typeof(Configuration.Abilities))]
        public Configuration.Abilities Ability
        {
            get => Enum.Parse<Configuration.Abilities>(AbilityId);
            set => AbilityId = value.ToString();
        }

        public AccessBase() { }

        public static Result<T> Create<T>(Guid folderId, Guid userId, Configuration.Abilities ability) where T : AccessBase, new()
        {
            if (folderId == Guid.Empty)
                return Result.Failure<T>("Invalid folder id");

            if (userId == Guid.Empty)
                return Result.Failure<T>("Invalid user id");

            return new T
            {
                Id = Guid.NewGuid(),
                ItemId = folderId,
                UserId = userId,
                Ability = ability
            };
        }
    }
}