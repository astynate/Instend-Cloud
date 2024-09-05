using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Links
{
    public class AlbumLinks
    {
        [Table("album_links")] public class AlbumLink : LinkBase { }
        [Table("album_comment_links")] public class AlbumCommentLink : LinkBase { }
        [Table("attachment_comment_links")] public class AttachmentCommentLink : LinkBase { }
    }
}