using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Storage.Album;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Access
{
    [Table("files_accounts")]
    public class FileAccount : AccessBase
    {
        public Guid FileId { get; init; }
        public List<Album> Albums { get; set; } = [];

        public FileAccount(Guid fileId, Guid accountId, Configuration.EntityRoles ability) : base(accountId, ability)
        {
            FileId = fileId;
        }
    }
}