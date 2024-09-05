using Exider.Core.Models.Messages;
using Exider.Core.Models.Messenger;

namespace Exider_Version_2._0._0.Server.TransferModels.Messenger
{
    public record class MessengerTransferModel
    (
        (DirectModel, MessageModel)[] directs
    );
}