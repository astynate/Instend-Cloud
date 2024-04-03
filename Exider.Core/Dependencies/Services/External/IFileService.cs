using CSharpFunctionalExtensions;
using Exider.Core.Models.Storage;

namespace Exider.Services.External.FileService
{
    public interface IFileService
    {
        Result<string> GetFileAsHTMLBase64String(FileModel fileModel);
        Task<byte[]> GetPdfPreviewImage(string path);
        Task<byte[]> GetWordDocumentPreviewImage(string path);
        Task<Result<byte[]>> ReadFileAsync(string path);
        string WordToHTML(string path);
    }
}