using Exider.Core.Models.Messages;
using Exider.Core.TransferModels.Account;

namespace Exider.Core.TransferModels
{
    public class MessengerTransferModelBase
    {
        public MessageModel? messageModel;

        public int queueId = 1;

        public UserPublic? userPublic;
    }
}