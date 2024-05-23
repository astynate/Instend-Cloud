using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Links
{
    [Table("playlist_links")] public class PlaylistLinks : LinkBase { }
    [Table("playlist_comment_links")] public class PlaylistCommentLinks : LinkBase { }
}