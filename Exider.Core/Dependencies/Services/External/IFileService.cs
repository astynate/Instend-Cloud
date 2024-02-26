using CSharpFunctionalExtensions;

namespace Exider.Services.External.FileService
{
    public interface IFileService
    {
        Task<Result<byte[]>> ReadFileAsync(string path);
    }
}