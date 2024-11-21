using Instend.Core.Models.Account;
using Instend.Core.Models.Messages;

namespace Instend.Core.TransferModels.Messenger
{
    public class MessengerTransferModelBase
    {
        public object model = new { };

        public int queueId = 1;

        public MessageModel? message;

        public AccountModel? account;
    }
}