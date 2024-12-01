using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Messenger.Message
{
    [Table("messages_attachments")] 
    public class MessageAttachment : DatabaseModel
    {
        [Column("message_id")]
        public Guid MessageId { get; private set; }

        [Column("reaction_id")]
        public Guid AttachmentId { get; private set; }
    }
}