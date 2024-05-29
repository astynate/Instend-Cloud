using Exider.Core.Models.Links;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Messages
{
    [Table("direct_links")]
    public class DirectMessageLink : LinkBase 
    { 
        [Column("date")] public DateTime Date { get; set; } = DateTime.Now;
    }
}