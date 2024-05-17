using CSharpFunctionalExtensions;
using Exider.Core.Models.Storage;
using Exider.Repositories.Storage;

namespace Exider.Services.External.FileService
{
    public interface IFileService
    {
        Task DeleteFolderById(IFileRespository fileRespository, IFolderRepository folderRepository, Guid id);
        Result<string> GetFileAsHTMLBase64String(FileModel fileModel);
        Task<Result<byte[]>> ReadFileAsync(string path);
        byte[] CreateZipFromFiles(FileModel[] files);
        byte[] GetPdfPreviewImage(string path);
        byte[] GetWordDocumentPreviewImage(string path);
        string WordToHTML(string path);
        string ConvertSystemTypeToContentType(string systemType);
        Task WriteFileAsync(string path, byte[] file);
    }
}