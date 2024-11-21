using Instend.Core.Models.Messages;
using Instend.Core.Models.Messenger;

namespace Instend_Version_2._0._0.Server.TransferModels.Messenger
{
    public record class MessengerTransferModel
    (
        (DirectModel, MessageModel)[] directs
    );
}