using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Messenger.Message
{
    [Table("messages_collections")] 
    public class MessageCollection : DatabaseModel 
    {
        [Column("message_id")]
        public Guid MessageId { get; private set; }

        [Column("reaction_id")]
        public Guid CollectionId { get; private set; }
    }
}