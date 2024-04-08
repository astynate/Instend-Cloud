using CSharpFunctionalExtensions;
using Exider.Core.Models.Storage;

namespace Exider.Repositories.Storage
{
    public interface IFileRespository
    {
        Task<Result<FileModel>> AddAsync(string name, string? type, Guid ownerId, Guid folderId);
        Task<Result> Delete(Guid id);
        Task<FileModel[]> GetByFolderId(Guid userId, Guid folderId);
        Task<Result<FileModel>> GetByIdAsync(Guid id);
        Task<Result<FileModel>> UpdateName(Guid id, string name);
    }
}