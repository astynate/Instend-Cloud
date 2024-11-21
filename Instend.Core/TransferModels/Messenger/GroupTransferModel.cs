using Instend.Core.Models.Messenger;
using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.TransferModels.Messenger
{
    public class GroupTransferModel : MessengerTransferModelBase
    {
        public new GroupModel? model;
    }

    [Table("group_message_links")]
    public class GroupMessageLink : LinkBase
    {
        [Column("date")] public DateTime Date { get; set; } = DateTime.Now;
    }
}