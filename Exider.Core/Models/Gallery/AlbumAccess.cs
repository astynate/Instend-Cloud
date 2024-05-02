using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Exider.Core.Models.Gallery
{
    [Table("album_access")]
    public class AlbumAccess
    {
        [Key][Column("id")] public Guid Id { get; private set; }
        [Column("album_id")] public Guid AlbumId { get; private set; }
        [Column("user_id")] public Guid UserId { get; private set; }
        [Column("ability")] public string AbilityId { get; private set; } = Configuration.Abilities.Read.ToString();

        [EnumDataType(typeof(Configuration.Abilities))]
        [NotMapped]
        public Configuration.Abilities Ability
        {
            get => Enum.Parse<Configuration.Abilities>(AbilityId);
            set => AbilityId = value.ToString();
        }

        private AlbumAccess() { }

        public static Result<AlbumAccess> Create(Guid albumId, Guid userId, Configuration.Abilities ability)
        {
            if (albumId == Guid.Empty)
            {
                return Result.Failure<AlbumAccess>("Invalid folder id");
            }

            if (userId == Guid.Empty)
            {
                return Result.Failure<AlbumAccess>("Invalid user id");
            }

            return Result.Success(new AlbumAccess()
            {
                Id = Guid.NewGuid(),
                AlbumId = albumId,
                UserId = userId,
                Ability = ability
            });
        }
    }
}
