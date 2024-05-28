using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Messages
{
    [Table("messages")]
    public class MessageModel
    {
        [Column("id")][Key] public Guid Id { get; set; } = Guid.NewGuid();
        [Column("text")] public string Text { get; set; } = string.Empty;
        [Column("user_id")] public Guid UserId { get; set; }
        [Column("date")] public DateTime Date { get; set; } = DateTime.Now;
    }
}