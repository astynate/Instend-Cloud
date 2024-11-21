using Instend.Core.Models.Account;
using Instend.Core.Models.Messages;
using Instend.Core.Models.Messenger;

namespace Instend.Core.TransferModels.Messenger
{
    public class DirectTransferModel : MessengerTransferModelBase
    {
        public new DirectModel model;

        public bool isChatCreated = false;

        public DirectTransferModel(DirectModel model, MessageModel? message, AccountModel account)
        {
            this.model = model;
            this.message = message;
            this.account = account;
        }
    }
}