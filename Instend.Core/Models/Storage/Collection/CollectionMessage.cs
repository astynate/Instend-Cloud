using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Storage.Collection
{
    public class CollectionMessage : DatabaseModel
    {
        [Column("collection_id")]
        public Guid CollectionId { get; private set; }

        [Column("message_id")]
        public Guid MessageId { get; private set; }
    }
}