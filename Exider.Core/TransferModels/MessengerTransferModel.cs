using Exider.Core.Models.Messages;
using Exider.Core.Models.Messenger;
using Exider.Core.TransferModels.Account;

namespace Exider.Core.TransferModels
{
    public class MessengerTransferModel
    {
        public DirectModel directModel;
        public MessageModel? messageModel;
        public UserPublic userPublic;

        public MessengerTransferModel(DirectModel directModel, MessageModel? messageModel, UserPublic userPublic)
        {
            this.directModel = directModel;
            this.messageModel = messageModel;
            this.userPublic = userPublic;
        }
    }
}