using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Links
{
    [Table("album_views")]
    public class AlbumViewLink : LinkBase
    {
        [Column("time")] DateTime Time { get; set; } = DateTime.Now;
    }
}