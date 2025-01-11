using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Abstraction
{
    public abstract class AccessBase : DatabaseModel
    {
        [Column("role")] public string RoleId { get; protected set; } = Configuration.EntityRoles.Reader.ToString();
        [Column("account_id")] public Guid AccountId { get; init; } = Guid.Empty;

        public Account.Account Account { get; init; } = null!;

        [NotMapped]
        [EnumDataType(typeof(Configuration.EntityRoles))]
        public Configuration.EntityRoles Role
        {
            get => Enum.Parse<Configuration.EntityRoles>(RoleId);
            set => RoleId = value.ToString();
        }

        protected AccessBase() { }

        public AccessBase(Configuration.EntityRoles role) 
        {
            Role = role;
        }
    }
}