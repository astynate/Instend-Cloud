using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Storage.File;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Publication
{
    [Table("publications_attachments")] 
    public class PublicationAttachment : DatabaseModel 
    {
        [Column("group_id")] public Guid PublicationId { get; set; }
        [Column("attachment_id")] public Guid AttachmentId { get; set; }

        public Public.Publication Publication { get; init; } = null!;
        public Attachment Attachment { get; init; } = null!;
    }
}