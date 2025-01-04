using Microsoft.AspNetCore.Http;

namespace Instend.Repositories.Publications
{
    public record PublicationTransferModel
    (
        string? text,
        IFormFile[]? attachments
    );

    public record UpdatePublicationTransferModel
    (
        Guid id,
        string? text,
        AttachmentTransferModel[]? attachments
    );

    public record AttachmentTransferModel
    (
        Guid id,
        IFormFile? attachment
    );
}