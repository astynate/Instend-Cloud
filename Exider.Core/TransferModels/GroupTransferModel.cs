using Exider.Core.Models.Links;
using Exider.Core.Models.Messenger;

namespace Exider.Core.TransferModels
{
    public class GroupTransferModel : MessengerTransferModelBase
    {
        public GroupModel? groupModel;
    }

    public class GroupMessageLink : LinkBase { }
}