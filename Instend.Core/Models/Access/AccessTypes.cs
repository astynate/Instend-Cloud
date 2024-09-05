using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Access
{
    [Table("folder_access")] public class FolderAccess : AccessBase { }
    [Table("file_access")] public class FileAccess : AccessBase { }
    [Table("album_access")] public class AlbumAccess : AccessBase { }
    [Table("playlist_access")] public class PlaylistAccess : AccessBase { }
}