using CSharpFunctionalExtensions;

namespace Exider.Services.External.FileService
{
    public interface IPreviewService
    {
        Task<Result<byte[]>> GetPreview(string? type, string path);
    }
}