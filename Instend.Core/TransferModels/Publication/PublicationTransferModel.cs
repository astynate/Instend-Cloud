using Microsoft.AspNetCore.Http;

namespace Instend.Repositories.Publications
{
    public record PublicationTransferModel
    (
        string? text,
        IFormFile[]? attachments
    );
}