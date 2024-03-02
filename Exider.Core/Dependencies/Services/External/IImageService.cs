using CSharpFunctionalExtensions;

namespace Exider.Services.External.FileService
{
    public interface IImageService
    {
        Task<Result> UpdateAvatar(string path, byte[] avatar);
    }
}