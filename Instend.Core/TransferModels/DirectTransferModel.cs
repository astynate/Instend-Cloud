using Exider.Core.Models.Messages;
using Exider.Core.Models.Messenger;
using Exider.Core.TransferModels.Account;

namespace Exider.Core.TransferModels
{
    public class DirectTransferModel : MessengerTransferModelBase
    {   
        public new DirectModel model;

        public bool isChatCreated = false;

        public DirectTransferModel(DirectModel model, MessageModel? messageModel, UserPublic userPublic)
        {
            this.model = model;
            this.messageModel = messageModel;
            this.userPublic = userPublic;
        }
    }
}