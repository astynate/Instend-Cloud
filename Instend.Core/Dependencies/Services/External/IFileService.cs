using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage;
using Instend.Repositories.Storage;

namespace Instend.Services.External.FileService
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