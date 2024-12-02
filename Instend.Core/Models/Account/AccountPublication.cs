using System.ComponentModel.DataAnnotations.Schema;
using Instend.Core.Models.Abstraction;

namespace Instend.Core.Models.Account
{
    [Table("accounts_publications")] 
    public class AccountPublication : DatabaseModel 
    {
        [Column("account_id")] public Guid AccountId { get; init; }
        [Column("publication_id")] public Guid PublicationId { get; init; }

        public AccountPublication(Guid accountId, Guid publicationId)
        {
            AccountId = accountId;
            PublicationId = publicationId;
        }
    }
}