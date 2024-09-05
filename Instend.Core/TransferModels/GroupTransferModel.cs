using Exider.Core.Models.Links;
using Exider.Core.Models.Messenger;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.TransferModels
{
    public class GroupTransferModel : MessengerTransferModelBase
    {
        public new GroupModel? model;
    }

    [Table("group_message_links")] public class GroupMessageLink : LinkBase 
    {
        [Column("date")] public DateTime Date { get; set; } = DateTime.Now;
    }
}