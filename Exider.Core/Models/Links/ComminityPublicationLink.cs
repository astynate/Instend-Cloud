using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Links
{
    [Table("community_publication_links")] public class ComminityPublicationLink : LinkBase { }
    [Table("community_followers")] public class CommunityFollowerLink : LinkBase { }
}