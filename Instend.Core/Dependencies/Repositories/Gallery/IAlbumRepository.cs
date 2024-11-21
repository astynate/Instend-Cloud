using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Services.External.FileService;
using Instend.Core.Models.Storage;

namespace Instend.Repositories.Gallery
{
    public interface IAlbumRepository
    {
        Task<Result<AlbumModel>> AddAsync(Guid ownerId, byte[] cover, string name, string? description, Configuration.AlbumTypes type);
        Task<AlbumModel?> GetByIdAsync(Guid id);
        Task<Result<AlbumModel>> DeleteAlbumAsync(Guid id, Guid userId);
        Task<Result<AlbumModel[]>> GetAlbums(IImageService imageService, Guid userId, Configuration.AlbumTypes type);
        Task<Result> UpdateAlbum(Guid id, byte[] cover, string? name, string? description);
        Task<AlbumModel[]> GetAlbums(Guid userId);
    }
}