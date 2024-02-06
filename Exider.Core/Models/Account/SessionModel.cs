using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Account
{
    public class SessionModel
    {

        [Column("id")] public Guid Id { get; set; }

        [Column("device")] public string Device { get; set; } = null!;

        [Column("browser")] public string Browser { get; set; } = null!;

        [Column("ip_address")] public string IpAddress { get; set; } = null!;

        [Column("location")] public string Location { get; set; } = null!;

        [Column("creation_time")] public DateTime CreationTime { get; set; }

        [Column("end_time")] public DateTime EndTime { get; set; }

        [Column("token")] public string RefreshToken { get; set; } = null!;

        [Column("user_id")] public Guid UserId { get; set; }

    }

}
