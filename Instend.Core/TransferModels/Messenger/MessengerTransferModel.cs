using Instend.Core.Models.Messenger.Direct;
using Instend.Core.Models.Messenger.Message;

namespace Instend_Version_2._0._0.Server.TransferModels.Messenger
{
    public record class MessengerTransferModel
    (
        (Direct, Message)[] directs
    );
}