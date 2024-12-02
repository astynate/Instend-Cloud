using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Repositories.Gallery;
using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Storage.Album;
using System.Collections.Generic;

namespace Instend.Repositories.Storage
{
    public class AlbumsRepository : IAlbumsRepository
    {
        private readonly StorageContext _storageContext = null!;

        private readonly AccessContext _accessContext = null!;

        private readonly AccountsContext _accountsContext = null!;

        public AlbumsRepository(AccountsContext accountsContext, StorageContext storageContext, AccessContext accessContext)
        {
            _storageContext = storageContext;
            _accountsContext = accountsContext;
            _accessContext = accessContext;
        }

        public async Task<Album[]> GetAlbums(Guid userId, Configuration.AlbumTypes type, int skip, int take)
        {
            var albums = await _storageContext.AlbumAccounts
                .AsNoTracking()
                .Where(x => x.AccountId == userId)
                .Include(x => x.Albums)
                .Select(x => x.Albums)
                .Skip(skip)
                .Take(take)
                .ToArrayAsync();

            return albums;
        }

        public async Task<List<Album>> GetAllAccountAlbums(Guid accountId)
        {
            var albums = await _storageContext.AlbumAccounts
                .AsNoTracking()
                .Where(x => x.AccountId == accountId)
                .Include(x => x.Albums)
                .SelectMany(x => x.Albums)
                .ToListAsync();

            var albumsWhichAccountIsOwn = await _storageContext.Albums
                .AsNoTracking()
                .Where(x => x.AccountId == accountId)
                .ToListAsync();

            albums
                .AddRange(albumsWhichAccountIsOwn);

            return albums;
        }

        public async Task<Result<Album>> AddAsync(Guid ownerId, byte[] cover, string name, string? description, Configuration.AlbumTypes type)
        {
            var albumModel = Album.Create
            (
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

        public async Task<Result<Album>> DeleteAlbumAsync(Guid id, Guid userId)
        {
            var album = await _storageContext.Albums
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id && x.AccountId == userId);

            if (album == null)
                return Result.Failure<Album>("Album not found or you don't have an permissions to perform this operation");

            _storageContext.Remove(album);
            await _storageContext.SaveChangesAsync();
            
            return Result.Success(album);
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
    }
}