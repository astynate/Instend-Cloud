using CSharpFunctionalExtensions;

namespace Instend.Repositories.Storage
{
    public interface IFilesRespository
    {
        Task<Result<Core.Models.Storage.File.File>> AddAsync(string name, string? type, double size, Guid accountId, Guid? collectionId);
        Task Delete(Guid id);
        Task<Result<Core.Models.Storage.File.File>> GetByIdAsync(Guid id);
        Task<Core.Models.Storage.File.File[]> GetByParentCollectionId(Guid userId, Guid? parentCollectionId, int skip, int take);
        Task<object[]> GetFilesByPrefix(Guid userId, string prefix);
        Task<object[]> GetLastFilesWithType(Guid userId, int from, int count, string[] type);
        Task<Result<Core.Models.Storage.File.File>> UpdateName(Guid id, string name);
    }
}