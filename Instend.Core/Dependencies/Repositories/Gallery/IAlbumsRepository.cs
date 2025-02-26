using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Storage.Album;

namespace Instend.Repositories.Gallery
{
    public interface IAlbumsRepository
    {
        Task<Result<Album>> AddAsync(Guid ownerId, byte[] cover, string name, string typeOfCover, string? description, Configuration.AlbumTypes type);
        Task<Result<Album>> DeleteAlbumAsync(Guid id, Guid userId);
        Task<Album[]> GetAlbums(Guid userId, Configuration.AlbumTypes type, int skip, int take);
        Task<List<Album>> GetAllAccountAlbums(Guid accountId);
        Task<Album?> GetByIdAsync(Guid id, int skip, int take);
        Task<Result> UpdateAlbum(Guid id, byte[] cover, string? name, string? description);
    }
}