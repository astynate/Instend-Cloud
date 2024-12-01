using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage.File;

namespace Instend.Repositories.Storage
{
    public interface IFileRespository
    {
        Task<Result<Core.Models.Storage.File.File>> AddAsync(string name, string? type, double size, Guid ownerId, Guid folderId);
        Task<Result<Core.Models.Storage.File.File>> AddPhotoAsync(string name, string? type, double size, Guid ownerId);
        Task<Result> Delete(Guid id);
        Task<Core.Models.Storage.File.File[]> GetByFolderId(Guid userId, Guid folderId);
        Task<object[]> GetByFolderIdWithMetaData(Guid userId, Guid folderId);
        Task<Result<Core.Models.Storage.File.File>> GetByIdAsync(Guid id);
        Task<Core.Models.Storage.File.File[]> GetLastPhotoByUserIdAsync(Guid userId, int from, int count);
        Task<object[]> GetLastFilesWithType(Guid userId, int from, int count, string[] type);
        Task<Core.Models.Storage.File.File[]> GetLastPhotoFromAlbum(Guid guid1, Guid guid2, int from, int count);
        Task<Result<Core.Models.Storage.File.File>> UpdateName(Guid id, string name);
        Task<object[]> GetLastItemsFromAlbum(Guid userId, Guid albumId, int from, int count);
        Task<object[]> GetFilesByPrefix(Guid userId, string prefix);
    }
}