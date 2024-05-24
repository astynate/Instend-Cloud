using CSharpFunctionalExtensions;
using Exider.Core.Models.Albums;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;

namespace Exider.Repositories.Gallery
{
    public interface IAlbumRepository
    {
        Task<Result<AlbumModel>> AddAsync(Guid ownerId, byte[] cover, string name, string? description);
        Task<AlbumModel?> GetByIdAsync(Guid id);
        Task<Result<AlbumModel>> DeleteAlbumAsync(Guid id, Guid userId);
        Task<Result<AlbumModel[]>> GetAlbums(IImageService imageService, Guid userId);
        Task<Result> UpdateAlbum(Guid id, byte[] cover, string? name, string? description);
    }
}