using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Instend.Core.TransferModels.Messenger
{
    public record MessageTransferModel
    (
        [Required] Guid id,
        [Required] string text,
        [Required] int type,
        [Required] int queueId,
        IFormFile[]? attachments,
        Guid[]? fileIds,
        Guid[]? folderIds,
        Guid? replyTo
    );
}