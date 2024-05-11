using CSharpFunctionalExtensions;
using Exider.Core.Models.Gallery;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;

namespace Exider.Repositories.Gallery
{
    public interface IAlbumRepository
    {
        Task<Result<AlbumModel>> AddAsync(Guid ownerId, byte[] cover, string name, string description);
        Task<Result<FileModel>> AddPhotoToAlbum(Guid fileId, Guid albumId);
        Task<Result<AlbumModel>> DeleteAlbumAsync(Guid id, Guid userId);
        Task<Result<AlbumModel[]>> GetAlbums(IImageService imageService, Guid userId);
        Task<Result<FileModel>> UploadPhotoToAlbum(FileModel file, Guid albumId);
    }
}