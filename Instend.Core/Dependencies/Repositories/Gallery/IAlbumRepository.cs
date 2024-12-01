using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Services.External.FileService;
using Instend.Core.Models.Storage.Album;

namespace Instend.Repositories.Gallery
{
    public interface IAlbumRepository
    {
        Task<Result<Album>> AddAsync(Guid ownerId, byte[] cover, string name, string? description, Configuration.AlbumTypes type);
        Task<Album?> GetByIdAsync(Guid id);
        Task<Result<Album>> DeleteAlbumAsync(Guid id, Guid userId);
        Task<Result<Album[]>> GetAlbums(IImageService imageService, Guid userId, Configuration.AlbumTypes type);
        Task<Result> UpdateAlbum(Guid id, byte[] cover, string? name, string? description);
        Task<Album[]> GetAlbums(Guid userId);
    }
}