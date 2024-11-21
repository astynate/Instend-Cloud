using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage;
using Instend.Core.Models.Abstraction;

namespace Instend.Repositories.Storage
{
    public interface IFormatRepository<T> where T : FormatBase
    {
        Task<Result<object>> AddAsync(Guid fileId, string type, string path);
        Task<Result<(FileModel?, T?)>> GetByIdWithMetaData(Guid fileId);
        Task SaveChanges(T? format);
        Task<Result<T>> GetMetaDataAsync(Guid fileId);
    }
}