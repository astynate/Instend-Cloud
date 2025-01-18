using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Storage.Files
{
    [Table("files_accounts")]
    public class FileAccount : AccessBase
    {
        public File.File File { get; set; } = null!;
        [Column("file_id")] public Guid FileId { get; set; } = Guid.Empty;

        private FileAccount() { }

        public FileAccount(Guid fileId, Guid accountId, Configuration.EntityRoles ability) : base(ability)
        {
            FileId = fileId;
            AccountId = accountId;
        }
    }
}