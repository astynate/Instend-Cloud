using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Access
{
    [Table("collections_accounts")]
    public class CollectionAccount : AccessBase
    {
        public Storage.Collection.Collection Collection { get; init; } = null!;

        private CollectionAccount() { }

        public CollectionAccount(Storage.Collection.Collection collection, Configuration.EntityRoles ability) : base(ability) 
        { 
            Collection = collection;
        }
    }
}