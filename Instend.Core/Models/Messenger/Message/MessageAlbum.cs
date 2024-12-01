using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Messenger.Message
{
    [Table("messages_albums")]
    public class MessageAlbum : DatabaseModel
    {
        [Column("message_id")] 
        public Guid MessageId { get; private set; }

        [Column("album_id")] 
        public Guid AlbumId { get; private set; }
    }
}