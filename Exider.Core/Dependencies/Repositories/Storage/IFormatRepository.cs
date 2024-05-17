using CSharpFunctionalExtensions;
using Exider.Core.Models.Formats;
using Exider.Services.External.FileService;

namespace Exider.Repositories.Storage
{
    public interface IFormatRepository<T> where T : FormatBase
    {
        Task<Result> AddAsync(IFileService fileService, Guid fileId, byte[] file);
    }
}