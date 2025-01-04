using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Account
{
    [Table("accounts_links")]
    public class AccountLink
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;
        public Guid LinkId { get; set; }
        public Guid? AccountId { get; set; }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}