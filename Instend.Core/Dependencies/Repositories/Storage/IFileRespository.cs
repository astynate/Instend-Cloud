using CSharpFunctionalExtensions;
namespace Instend.Repositories.Storage
{
    public interface IFileRespository
    {
        Task<Core.Models.Storage.File.File[]> GetByParentCollectionId(Guid userId, Guid folderId);
        Task<Result<Core.Models.Storage.File.File>> GetByIdAsync(Guid id);
        Task<object[]> GetFilesByPrefix(Guid userId, string prefix);
        Task<object[]> GetLastFilesWithType(Guid userId, int from, int count, string[] type);
        Task<Result<Core.Models.Storage.File.File>> AddAsync(string name, string? type, double size, Guid ownerId, Guid folderId);
        Task<Result<Core.Models.Storage.File.File>> UpdateName(Guid id, string name);
        Task<Result> Delete(Guid id);
    }
}