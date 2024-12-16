using CSharpFunctionalExtensions;

namespace Instend.Services.External.FileService
{
    public interface IPreviewService
    {
        Task<Result<byte[]>> GetPreview(string? type, string path);
    }
}