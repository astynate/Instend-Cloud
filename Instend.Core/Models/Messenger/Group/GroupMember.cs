using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Messenger.Group
{
    [Table("groups_members")] 
    public class GroupMember : DatabaseModel
    {
        [Column("group_id")] public Guid GroupId { get; private set; }
        [Column("account_id")] public Guid AccountId { get; private set; }

        public Group? Group { get; set; } = null!;

        public GroupMember(Guid groupId, Guid accountId)
        {
            GroupId = groupId;
            AccountId = accountId;
        }
    }
}