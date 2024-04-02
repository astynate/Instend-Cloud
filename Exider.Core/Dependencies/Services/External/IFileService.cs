using CSharpFunctionalExtensions;

namespace Exider.Services.External.FileService
{
    public interface IFileService
    {
        Task<byte[]> GetPdfPreviewImage(string path);
        Task<byte[]> GetWordDocumentPreviewImage(string path);
        Task<Result<byte[]>> ReadFileAsync(string path);
    }
}