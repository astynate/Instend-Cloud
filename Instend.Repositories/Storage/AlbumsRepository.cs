using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Repositories.Gallery;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Storage.Album;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Storage
{
    public class AlbumsRepository : IAlbumsRepository
    {
        private readonly GlobalContext _context = null!;

        public AlbumsRepository(GlobalContext storageContext)
        {
            _context = storageContext;
        }

        public async Task<Album?> GetByIdAsync(Guid id, int skip, int take)
        {
            var album = await _context.Albums
                .AsNoTracking()
                    .Where(x => x.Id == id)
                    .Include(x => x.Files
                        .OrderBy(x => x.CreationTime)
                        .Skip(skip)
                        .Take(take))
                    .Include(x => x.AccountsWithAccess)
                    .FirstOrDefaultAsync();

            return album;
        }

        public async Task<Album[]> GetAlbums(Guid userId, Configuration.AlbumTypes type, int skip, int take)
        {
            var albums = await _context.AlbumsAccounts
                .Where(x => x.AccountId == userId)
                .Include(x => x.Account)
                .Include(x => x.Album)
                    .ThenInclude(x => x.Files.Skip(0).Take(5))
                .Include(x => x.Album)
                    .ThenInclude(x => x.AccountsWithAccess)
                .OrderByDescending(x => x.Album.CreationTime)
                .Where(x => x.Album.TypeId == type.ToString())
                .Skip(skip)
                .Take(take)
                .Select(x => x.Album)
                .ToArrayAsync();

            return albums;
        }

        public async Task<List<Album>> GetAllAccountAlbums(Guid accountId)
        {
            var albums = await _context.AlbumsAccounts
                .AsNoTracking()
                .Where(x => x.AccountId == accountId)
                .Include(x => x.Album)
                    .ThenInclude(x => x.AccountsWithAccess)
                .Select(x => x.Album)
                .ToListAsync();

            return albums;
        }

        public async Task<Result<Album>> AddAsync(Guid ownerId, byte[] cover, string name, string typeOfCoverFile, string? description, Configuration.AlbumTypes type)
        {
            var album = Album.Create(name, typeOfCoverFile, description, type, Configuration.AccessTypes.Private);

            if (album.IsFailure)
                return Result.Failure<Album>(album.Error);

            var owner = new AlbumAccount(album.Value, ownerId, Configuration.EntityRoles.Owner);

            await System.IO.File.WriteAllBytesAsync(album.Value.Cover, cover);

            await _context.AddAsync(album.Value);
            await _context.SaveChangesAsync();

            await _context.AddAsync(owner);
            await _context.SaveChangesAsync();

            album.Value.AccountsWithAccess
                .ToList()
                .Add(owner);

            return Result.Success(album.Value);
        }

        public async Task<Result<Album>> DeleteAlbumAsync(Guid id, Guid userId)
        {
            var album = await _context.Albums
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

            if (album == null)
                return Result.Failure<Album>("album not found or you don't have an permissions to perform this operation");

            _context.Remove(album);
            await _context.SaveChangesAsync();
            
            return Result.Success(album);
        }

        public async Task<Result> UploadFilesInAlbum(Guid id, Core.Models.Storage.File.File[] files)
        {
            await _context.AlbumsFiles.AddRangeAsync(files.Select(x => new AlbumFile(id, x.Id)));
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        public async Task<Result> UpdateAlbum(Guid id, byte[] cover, string? name, string? description)
        {
            //var albumModel = await _storageContext.Albums
            //    .FirstOrDefaultAsync(x => x.Id == id);

            //if (albumModel == null)
            //    return Result.Failure("album not found");

            //albumModel.Update(name, description);

            //if (cover.Length > 0)
            //    await File.WriteAllBytesAsync(albumModel.Cover, cover);

            //await _storageContext.SaveChangesAsync();
            return Result.Success();
        }

        public async Task RemoveFileFromAlbum(Guid id, Guid file)
        {
            await _context.AlbumsFiles
                .Where(x => x.FileId == file && x.AlbumId == id)
                .ExecuteDeleteAsync();
        }
    }
}