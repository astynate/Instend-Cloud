using CSharpFunctionalExtensions;
using Exider.Core.Models.Storage;
using Exider.Repositories.Storage;

namespace Exider.Services.External.FileService
{
    public interface IFileService
    {
        byte[] CreateZipFromFiles(FileModel[] files);
        Task DeleteFolderById(IFileRespository fileRespository, IFolderRepository folderRepository, Guid id);
        Result<string> GetFileAsHTMLBase64String(FileModel fileModel);
        Task<byte[]> GetPdfPreviewImage(string path);
        Task<byte[]> GetWordDocumentPreviewImage(string path);
        Task<Result<byte[]>> ReadFileAsync(string path);
        string WordToHTML(string path);
    }
}