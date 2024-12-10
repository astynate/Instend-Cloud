using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Repositories.Gallery;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Storage.Album;
using Instend.Core.Models.Access;

namespace Instend.Repositories.Storage
{
    public class AlbumsRepository : IAlbumsRepository
    {
        private readonly StorageContext _storageContext = null!;

        public AlbumsRepository(StorageContext storageContext)
        {
            _storageContext = storageContext;
        }

        public async Task<Album?> GetByIdAsync(Guid id, int skip, int take)
        {
            var album = await _storageContext.Albums
                .AsNoTracking()
                .Where(x => x.Id == id)
                .Include(x => x.File)
                .Skip(skip)
                .Take(take)
                .Include(x => x.AccountsWithAccess)
                .FirstOrDefaultAsync();

            return album;
        }

        public async Task<Album[]> GetAlbums(Guid userId, Configuration.AlbumTypes type, int skip, int take)
        {
            var albums = await _storageContext.AlbumsAccounts
                .AsNoTracking()
                .Include(x => x.Account)
                .Where(x => x.Account.Id == userId)
                .Include(x => x.Album)
                    .ThenInclude(x => x.AccountsWithAccess)
                .Skip(skip)
                .Take(take)
                .Select(x => x.Album)
                .ToArrayAsync();

            return albums;
        }

        public async Task<List<Album>> GetAllAccountAlbums(Guid accountId)
        {
            var albums = await _storageContext.AlbumsAccounts
                .AsNoTracking()
                .Where(x => x.Account.Id == accountId)
                .Include(x => x.Album)
                    .ThenInclude(x => x.AccountsWithAccess)
                .Select(x => x.Album)
                .ToListAsync();

            return albums;
        }

        public async Task<Result<Album>> AddAsync(Guid ownerId, byte[] cover, string name, string? description, Configuration.AlbumTypes type)
        {
            var album = Album.Create(name, description, type, Configuration.AccessTypes.Private);

            if (album.IsFailure)
                return Result.Failure<Album>(album.Error);

            var owner = new AlbumAccount(album.Value, Configuration.EntityRoles.Owner);

            album.Value.AccountsWithAccess
                .ToList()
                .Add(owner);

            await File.WriteAllBytesAsync(album.Value.Cover, cover);

            await _storageContext.AddAsync(album.Value);
            await _storageContext.SaveChangesAsync();

            return Result.Success(album.Value);
        }

        public async Task<Result<Album>> DeleteAlbumAsync(Guid id, Guid userId)
        {
            var album = await GetByIdAsync(id, 0, 1);

            if (album == null)
                return Result.Failure<Album>("album not found or you don't have an permissions to perform this operation");

            _storageContext.Remove(album);
            await _storageContext.SaveChangesAsync();
            
            return Result.Success(album);
        }

        public async Task<Result> UpdateAlbum(Guid id, byte[] cover, string? name, string? description)
        {
            var albumModel = await _storageContext.Albums
                .FirstOrDefaultAsync(x => x.Id == id);

            if (albumModel == null)
                return Result.Failure("album not found");

            albumModel.Update(name, description);

            if (cover.Length > 0)
                await File.WriteAllBytesAsync(albumModel.Cover, cover);

            await _storageContext.SaveChangesAsync();
            return Result.Success();
        }
    }
}