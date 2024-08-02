using CSharpFunctionalExtensions;
using Exider.Core.Models.Storage;
using Exider.Repositories.Storage;

namespace Exider.Services.External.FileService
{
    public interface IFileService
    {
        Task DeleteFolderById(IFileRespository fileRespository, IFolderRepository folderRepository, IPreviewService preview, Guid id);
        Task<Result<byte[]>> ReadFileAsync(string path);
        byte[] CreateZipFromFiles(FileModel[] files);
        string ConvertSystemTypeToContentType(string systemType);
        Task WriteFileAsync(string path, byte[] file);
    }
}