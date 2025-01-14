using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Storage.Collection
{
    [Table("collections_accounts")]
    public class CollectionAccount : AccessBase
    {
        public Collection Collection { get; init; } = null!;
        public Guid CollectionId { get; init; } = Guid.Empty;

        private CollectionAccount() { }

        public CollectionAccount(Guid collectionId, Guid accountId, Configuration.EntityRoles role) : base(role)
        {
            CollectionId = collectionId;
            AccountId = accountId;
        }
    }
}