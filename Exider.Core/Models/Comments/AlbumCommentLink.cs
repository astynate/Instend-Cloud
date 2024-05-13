using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Comments
{
    [Table("album_comment_links")] public class AlbumCommentLink : CommentLinkBase { }
    [Table("playlist_comment_links")] public class PlaylistCommentLink : CommentLinkBase { }
}