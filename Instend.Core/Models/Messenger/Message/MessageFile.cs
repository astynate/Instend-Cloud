using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Messenger.Message
{
    [Table("messages_files")]
    public class MessageFile : DatabaseModel 
    {
        [Column("message_id")]
        public Guid MessageId { get; private set; }

        [Column("file_id")]
        public Guid FileId { get; private set; }
    }
}