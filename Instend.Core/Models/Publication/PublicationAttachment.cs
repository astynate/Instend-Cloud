using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Publication
{
    [Table("publications_attachments")] 
    public class PublicationAttachment : DatabaseModel 
    {
        [Column("group_id")]
        public Guid PublicationId { get; private set; }

        [Column("attachment_id")]
        public Guid AttachmentId { get; private set; }
    }
}