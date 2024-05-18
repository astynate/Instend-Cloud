using CSharpFunctionalExtensions;
using Exider.Core.Models.Formats;

namespace Exider.Repositories.Storage
{
    public interface IFormatRepository<T> where T : FormatBase
    {
        Task<Result<object>> AddAsync(Guid fileId, string type, string path);
        Task<Result<object>> GetMetaDataAsync(Guid fileId);
    }
}