using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Public
{
    [Table("publictions_reactions")] 
    public class PublicationReaction : DatabaseModel 
    {
        [Column("group_id")]
        public Guid PublicationId { get; private set; }

        [Column("reaction_id")]
        public Guid ReactionId { get; private set; }
    }
}