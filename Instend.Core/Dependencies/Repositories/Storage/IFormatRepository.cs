using CSharpFunctionalExtensions;
using Exider.Core.Models.Formats;
using Exider.Core.Models.Storage;

namespace Exider.Repositories.Storage
{
    public interface IFormatRepository<T> where T : FormatBase
    {
        Task<Result<object>> AddAsync(Guid fileId, string type, string path);
        Task<Result<(FileModel?, T?)>> GetByIdWithMetaData(Guid fileId);
        Task SaveChanges(T? format);
        Task<Result<T>> GetMetaDataAsync(Guid fileId);
    }
}