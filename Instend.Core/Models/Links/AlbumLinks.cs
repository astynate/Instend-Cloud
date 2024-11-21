using System.ComponentModel.DataAnnotations.Schema;
using Instend.Core.Models.Abstraction;

namespace Instend.Core.Models.Links
{
    public class AlbumLinks
    {
        [Table("album_links")] public class AlbumLink : LinkBase { }
        [Table("album_comment_links")] public class AlbumCommentLink : LinkBase { }
        [Table("attachment_comment_links")] public class AttachmentCommentLink : LinkBase { }
    }
}