using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage.Album;

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
        Task<object[]> GetFilesByPrefix(Guid userId, string prefix);
        Task<object[]> GetLastFilesWithType(Guid userId, int from, int count, string[] type);
        Task<Album[]> GetLastItemsFromAlbum(Guid userId, Guid albumId, int from, int count);
        Task<Core.Models.Storage.File.File[]> GetLastPhotoByUserIdAsync(Guid userId, int from, int count);
        Task<Core.Models.Storage.File.File[]> GetLastPhotoFromAlbum(Guid userId, Guid albumId, int from, int count);
        Task<Result<Core.Models.Storage.File.File>> UpdateName(Guid id, string name);
    }
}