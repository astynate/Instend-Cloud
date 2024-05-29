using Exider.Core.Models.Messages;
using Exider.Core.Models.Messenger;
using Exider.Core.TransferModels.Account;

namespace Exider.Core.TransferModels
{
    public record class MessengerTransferModel 
    (
        DirectModel directModel,
        MessageModel messageModel, 
        UserPublic userPublic
    );
}