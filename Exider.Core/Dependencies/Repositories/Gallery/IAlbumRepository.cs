using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Albums;
using Exider.Services.External.FileService;

namespace Exider.Repositories.Gallery
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