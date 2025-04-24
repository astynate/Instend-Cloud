using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Public
{
    [Table("publications_reactions")]
    public class PublicationReaction : DatabaseModel
    {
        [Column("publication_id")]
        public Guid PublicationId { get; private set; }

        [Column("reaction_id")]
        public Guid ReactionId { get; set; }

        [Column("account_id")]
        public Guid AccountId { get; set; }

        public Reaction Reaction { get; set; } = null!;
        public Publication Publication { get; set; } = null!;
        public Account.Account Account { get; set; } = null!;
    }
}