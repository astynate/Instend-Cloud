using Instend.Core.Models.Account;
using Instend.Core.Models.Messenger.Direct;
using Instend.Core.Models.Messenger.Message;

namespace Instend.Core.TransferModels.Messenger
{
    public class DirectTransferModel : MessengerTransferModelBase
    {
        public new Direct model;

        public bool isChatCreated = false;

        public DirectTransferModel(Direct model, Message? message, Models.Account.Account account)
        {
            this.model = model;
            this.message = message;
            this.account = account;
        }
    }
}