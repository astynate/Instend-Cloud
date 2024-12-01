using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Messenger.Group
{
    [Table("groups_messages")]
    public class GroupMessage : DatabaseModel
    {
        [Column("group_id")]
        public Guid GroupId { get; private set; }

        [Column("message_id")]
        public Guid MessageId { get; private set; }

        [Column("date")] 
        public DateTime Date { get; set; } = DateTime.Now;
    }
}