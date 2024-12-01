using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Storage.File;

namespace Instend.Repositories.Storage
{
    public interface IFormatRepository<T> where T : FormatBase
    {
        Task<Result<object>> AddAsync(Guid fileId, string type, string path);
        Task<Result<(Core.Models.Storage.File.File?, T?)>> GetByIdWithMetaData(Guid fileId);
        Task SaveChanges(T? format);
        Task<Result<T>> GetMetaDataAsync(Guid fileId);
    }
}