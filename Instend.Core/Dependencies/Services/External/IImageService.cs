using CSharpFunctionalExtensions;

namespace Instend.Services.External.FileService
{
    public interface IImageService
    {
        byte[] ResizeImageToBase64(byte[] inputImage, int maxSize, string type);
        byte[] CompressImage(byte[] inputImage, int quality, string type);
        Task<Result<string>> ReadImageAsBase64(string path);
    }
}