using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Messenger.Direct
{
    [Table("directs_messages")] 
    public class DirectMessage : DatabaseModel
    {
        [Column("direct_id")]
        public Guid DirectId { get; private set; }

        [Column("message_id")]
        public Guid MessageId { get; private set; }
    }
}