using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Abstraction
{
    public abstract class AccessBase : DatabaseModel
    {
        [Column("account_id")] public Guid AccountId { get; protected set; }
        [Column("role")] public string AbilityId { get; protected set; } = Configuration.EntityRoles.Reader.ToString();

        [NotMapped]
        [EnumDataType(typeof(Configuration.EntityRoles))]
        public Configuration.EntityRoles Ability
        {
            get => Enum.Parse<Configuration.EntityRoles>(AbilityId);
            set => AbilityId = value.ToString();
        }

        public AccessBase(Guid accountId, Configuration.EntityRoles role) 
        {
            AccountId = accountId;
            Ability = role;
        }
    }
}