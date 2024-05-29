using System.ComponentModel.DataAnnotations;

namespace Exider.Core.TransferModels.Messenger
{
    public record MessageTransferModel
    (
        [Required] Guid id,
        [Required] string userId,
        [Required] string text,
        [Required] int type
    );
}