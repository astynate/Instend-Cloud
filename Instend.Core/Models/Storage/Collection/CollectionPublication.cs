using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Storage.Collection
{
    public class CollectionPublication : DatabaseModel
    {
        [Column("collection_id")]
        public Guid CollectionId { get; private set; }

        [Column("publication_id")]
        public Guid PublicationId { get; private set; }
    }
}