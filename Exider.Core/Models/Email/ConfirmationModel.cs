using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Email
{
    public class ConfirmationModel
    {

        [Column("id")] public Guid Id { get; set; }

        [Column("code")] public string Code { get; set; } = null!;

        [Column("user")] public string UserId { get; set; } = null!;

    }
}
