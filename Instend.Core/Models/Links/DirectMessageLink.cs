using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Links
{
    [Table("direct_links")]
    public class DirectMessageLink : LinkBase
    {
        [Column("date")] public DateTime Date { get; set; } = DateTime.Now;
    }
}