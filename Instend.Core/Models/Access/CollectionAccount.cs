using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Access
{
    [Table("collections_accounts")]
    public class CollectionAccount : AccessBase
    {
        public Guid CollectionId { get; init; }

        public CollectionAccount(Guid collectionId, Guid accountId, Configuration.EntityRoles ability) : base(accountId, ability)
        {
            CollectionId = collectionId;
        }
    }
}