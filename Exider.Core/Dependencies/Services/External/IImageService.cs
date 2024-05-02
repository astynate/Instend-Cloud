using CSharpFunctionalExtensions;
using Exider.Repositories.Account;

namespace Exider.Services.External.FileService
{
    public interface IImageService
    {
        Task<Result> DeleteAvatar(IUserDataRepository repository, Guid userId, string path);
        Task<Result> DeleteHeader(IUserDataRepository repository, Guid userId, string path);
        Task<Result<string>> ReadImageAsBase64(string path);
        Task<Result> UpdateAvatar(IUserDataRepository repository, Guid userId, string path, string avatar);
        Task<Result> UpdateHeader(IUserDataRepository repository, Guid userId, string path, string header);
    }
}