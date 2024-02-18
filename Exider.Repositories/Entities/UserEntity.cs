using System.ComponentModel.DataAnnotations;

namespace Exider.Repositories.Entities
{
    public record UserEntity
    (
        [Required] Guid id,
        [Required] string name,
        [Required] string surname,
        [Required] string nickname,
        [Required] string email,
        [Required] string password,
        [Required] double storageSpace
    );
}
