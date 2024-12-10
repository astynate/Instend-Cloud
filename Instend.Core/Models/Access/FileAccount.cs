using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Access
{
    [Table("files_accounts")]
    public class FileAccount : AccessBase
    {
        public Storage.File.File File { get; set; } = null!;

        private FileAccount() { }
        public FileAccount(Configuration.EntityRoles ability) : base(ability) { }
    }
}