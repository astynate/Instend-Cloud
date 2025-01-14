using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Storage.Files
{
    [Table("files_accounts")]
    public class FileAccount : AccessBase
    {
        public File.File File { get; set; } = null!;

        private FileAccount() { }

        public FileAccount(File.File file, Account.Account account, Configuration.EntityRoles ability) : base(ability)
        {
            File = file;
            Account = account;
        }
    }
}