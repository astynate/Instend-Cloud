using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;

namespace Instend.Services.External.FileService
{
    public interface IPreviewService
    {
        Task<Result<byte[]>> GetPreview(string? type, string path);
        Task SetPreviewToIDatabaseCollection(IEnumerable<IDatabaseStorageRelation> relations);
    }
}