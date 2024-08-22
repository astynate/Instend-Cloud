using Exider.Core.Models.Messages;
using Exider.Core.Models.Messenger;
using Exider.Core.TransferModels.Account;

namespace Exider.Core.TransferModels
{
    public class DirectTransferModel : MessengerTransferModelBase
    {
        public DirectModel directModel;
        public bool isChatCreated = false;

        public DirectTransferModel(DirectModel directModel, MessageModel? messageModel, UserPublic userPublic)
        {
            this.directModel = directModel;
            this.messageModel = messageModel;
            this.userPublic = userPublic;
        }
    }
}