using Instend.Core.Models.Abstraction;
using NAudio.CoreAudioApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Messenger.Group
{
    [Table("groups_members")] 
    public class GroupMember : DatabaseModel
    {
        [Column("group_id")] public Guid GroupId { get; private set; }
        [Column("account_id")] public Guid AccountId { get; private set; }

        [Column("role")] public string RoleId { get; protected set; } = Configuration.EntityRoles.Reader.ToString();

        [NotMapped]
        [EnumDataType(typeof(Configuration.EntityRoles))]
        public Configuration.GroupRoles Role
        {
            get => Enum.Parse<Configuration.GroupRoles>(RoleId);
            set => RoleId = value.ToString();
        }

        public Group? Group { get; set; } = null!;
        public Account.Account? Account { get; set; } = null;

        private GroupMember() { }

        public GroupMember(Configuration.GroupRoles role, Guid groupId, Guid accountId)
        {
            Role = role;
            GroupId = groupId;
            AccountId = accountId;
        }
    }
}