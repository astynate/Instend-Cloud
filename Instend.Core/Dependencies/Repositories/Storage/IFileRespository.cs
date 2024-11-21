using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage;

namespace Instend.Repositories.Storage
{
    public interface IFileRespository
    {
        Task<Result<FileModel>> AddAsync(string name, string? type, double size, Guid ownerId, Guid folderId);
        Task<Result<FileModel>> AddPhotoAsync(string name, string? type, double size, Guid ownerId);
        Task<Result> Delete(Guid id);
        Task<FileModel[]> GetByFolderId(Guid userId, Guid folderId);
        Task<object[]> GetByFolderIdWithMetaData(Guid userId, Guid folderId);
        Task<Result<FileModel>> GetByIdAsync(Guid id);
        Task<FileModel[]> GetLastPhotoByUserIdAsync(Guid userId, int from, int count);
        Task<object[]> GetLastFilesWithType(Guid userId, int from, int count, string[] type);
        Task<FileModel[]> GetLastPhotoFromAlbum(Guid guid1, Guid guid2, int from, int count);
        Task<Result<FileModel>> UpdateName(Guid id, string name);
        Task<object[]> GetLastItemsFromAlbum(Guid userId, Guid albumId, int from, int count);
        Task<object[]> GetFilesByPrefix(Guid userId, string prefix);
    }
}