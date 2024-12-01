using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Repositories.Gallery;
using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Storage.Album;

namespace Instend.Repositories.Storage
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly StorageContext _storageContext = null!;

        private readonly AccessContext _accessContext = null!;

        public AlbumRepository(StorageContext storageContext, AccessContext accessContext)
        {
            _storageContext = storageContext;
            _accessContext = accessContext;
        }

        public async Task<Result<Album>> AddAsync
        (
            Guid ownerId, 
            byte[] cover, 
            string name, 
            string? description, 
            Configuration.AlbumTypes type
        )
        {
            var albumModel = Album.Create(
                name, 
                description, 
                DateTime.Now, 
                DateTime.Now, 
                ownerId, 
                type, 
                Configuration.AccessTypes.Private
            );

            if (albumModel.IsFailure)
                return Result.Failure<Album>(albumModel.Error);

            await File.WriteAllBytesAsync(albumModel.Value.Cover, cover);

            await _storageContext.AddAsync(albumModel.Value);
            await _storageContext.SaveChangesAsync();

            return Result.Success(albumModel.Value);
        }

        public async Task<Result<Album[]>> GetAlbums(IImageService imageService, Guid userId, Configuration.AlbumTypes type)
        {
            var albums = await _storageContext.Albums
                .AsNoTracking()
                .Where(x => x.AccountId == userId && x.TypeId == type.ToString())
                .ToArrayAsync();

            var accessAlbums = await _accessContext.AlbumAccess.AsNoTracking()
                .Where(x => x.UserId == userId)
                .Join(_storageContext.Albums,
                    access => access.ItemId,
                    album => album.Id,
                    (access, album) => album).ToArrayAsync();

            var combinedAlbums = albums.Concat(accessAlbums);

            foreach (var album in combinedAlbums)
            {
                await album.SetCover(imageService);
            }

            return Result.Success(combinedAlbums.ToArray());
        }

        public async Task<Result<Album>> DeleteAlbumAsync(Guid id, Guid userId)
        {
            var album = await _storageContext.Albums
                .FirstOrDefaultAsync(x => x.Id == id);

            if (album == null)
                return Result.Failure<Album>("Album not found");

            if (album.AccountId != userId)
                return Result.Failure<Album>("Only owners can delete an album.");

            var result = await _storageContext.Albums.Where(x => x.Id == id)
                .ExecuteDeleteAsync();

            if (result == 0)
                return Result.Failure<Album>("Album not found");

            File.Delete(album.Cover); return Result.Success(album);
        }

        public async Task<Album?> GetByIdAsync(Guid id)
        {
            return await _storageContext.Albums
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Result> UpdateAlbum(Guid id, byte[] cover, string? name, string? description)
        {
            var albumModel = await _storageContext.Albums
                .FirstOrDefaultAsync(x => x.Id == id);

            if (albumModel == null)
                return Result.Failure("Album not found");

            albumModel.Update(name, description);

            if (cover.Length > 0)
                await File.WriteAllBytesAsync(albumModel.Cover, cover);

            await _storageContext.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<Album[]> GetAlbums(Guid userId)
        {
            var albums = await _storageContext.Albums
                .AsNoTracking()
                .Where(x => x.AccountId == userId)
                .ToArrayAsync();

            var accessAlbums = await _accessContext.AlbumAccess.AsNoTracking()
                .Where(x => x.UserId == userId)
                .Join(_storageContext.Albums,
                    access => access.ItemId,
                    album => album.Id,
                    (access, album) => album)
                .ToArrayAsync();

            return albums.Concat(accessAlbums).ToArray();
        }
    }
}