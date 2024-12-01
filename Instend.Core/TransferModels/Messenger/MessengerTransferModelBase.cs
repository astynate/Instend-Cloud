using Instend.Core.Models.Account;
using Instend.Core.Models.Messenger.Message;

namespace Instend.Core.TransferModels.Messenger
{
    public class MessengerTransferModelBase
    {
        public object model = new { };

        public int queueId = 1;

        public Message? message;

        public Models.Account.Account? account;
    }
}