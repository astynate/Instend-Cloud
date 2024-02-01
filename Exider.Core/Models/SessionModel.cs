using System.ComponentModel.DataAnnotations.Schema;

namespace Exider_Version_2._0._0.ServerApp.Models
{
    public class SessionModel
    {
        [Column("id")] public uint id { get; set; }
        [Column("device")] public string _device { get; set; } = null!;
        [Column("browser")] public string _browser { get; set; } = null!;
        [Column("ip_address")] public string _ipAddress { get; set; } = null!;
        [Column("location")] public string _location { get; set; } = null!;
        [Column("creation_time")] public DateTime _creationTime { get; set; }
        [Column("end_time")] public DateTime _endTime { get; set; }
        [Column("token")] public string _refreshToken { get; set; } = null!;
        [Column("user_id")] public uint _userId { get; set; }
    }

}
