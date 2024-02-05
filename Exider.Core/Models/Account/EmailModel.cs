using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Account
{
    public class EmailModel
    {

        [Column("email")][Key] public string Email { get; set; } = null!;

        [Column("creation_time")] public DateTime CreationTime { get; set; }

        [Column("is_confirmed")] public bool IsConfirmed { get; set; }

        [Column("user_id")] public Guid UserId { get; set; }

    }
}
