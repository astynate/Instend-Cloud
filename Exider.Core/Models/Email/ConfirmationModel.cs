using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Email
{
    public class ConfirmationModel
    {
        [Column("link")][Key] public Guid Link { get; set; }

        [Column("email")] public string Email { get; set; } = null!;

        [Column("code")] public string Code { get; set; } = null!;

        [Column("end_time")] public DateTime EndTime { get; set; }

        [Column("user_id")] public Guid UserId { get; set; }

    }
}
