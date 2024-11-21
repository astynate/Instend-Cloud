using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Repositories.Gallery;
using Instend.Services.External.FileService;
using Instend.Core.Models.Storage;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Storage
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly DatabaseContext _context = null!;

        public AlbumRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Result<AlbumModel>> AddAsync
        (
            Guid ownerId, 
            byte[] cover, 
            string name, 
            string? description, 
            Configuration.AlbumTypes type
        )
        {
            var albumModel = AlbumModel.Create(
                name, 
                description, 
                DateTime.Now, 
                DateTime.Now, 
                ownerId, 
                type, 
                Configuration.AccessTypes.Private
            );

            if (albumModel.IsFailure)
                return Result.Failure<AlbumModel>(albumModel.Error);

            await File.WriteAllBytesAsync(albumModel.Value.Cover, cover);

            await _context.AddAsync(albumModel.Value);
            await _context.SaveChangesAsync();

            return Result.Success(albumModel.Value);
        }

        public async Task<Result<AlbumModel[]>> GetAlbums(IImageService imageService, Guid userId, Configuration.AlbumTypes type)
        {
            var albums = await _context.Albums.AsNoTracking()
                .Where(x => x.OwnerId == userId && x.TypeId == type.ToString()).ToArrayAsync();

            var accessAlbums = await _context.AlbumAccess.AsNoTracking()
                .Where(x => x.UserId == userId)
                .Join(_context.Albums,
                    access => access.ItemId,
                    album => album.Id,
                    (access, album) => album).ToArrayAsync();

            var combinedAlbums = albums.Concat(accessAlbums);

            foreach (AlbumModel album in combinedAlbums)
            {
                await album.SetCover(imageService);
            }

            return Result.Success(combinedAlbums.ToArray());
        }

        public async Task<Result<AlbumModel>> DeleteAlbumAsync(Guid id, Guid userId)
        {
            AlbumModel? album = await _context.Albums
                .FirstOrDefaultAsync(x => x.Id == id);

            if (album == null)
                return Result.Failure<AlbumModel>("Album not found");

            if (album.OwnerId != userId)
                return Result.Failure<AlbumModel>("Only owners can delete an album.");

            int result = await _context.Albums.Where(x => x.Id == id)
                .ExecuteDeleteAsync();

            if (result == 0)
                return Result.Failure<AlbumModel>("Album not found");

            File.Delete(album.Cover); return Result.Success(album);
        }

        public async Task<AlbumModel?> GetByIdAsync(Guid id)
        {
            return await _context.Albums.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Result> UpdateAlbum(Guid id, byte[] cover, string? name, string? description)
        {
            AlbumModel? albumModel = await _context.Albums
                .FirstOrDefaultAsync(x => x.Id == id);

            if (albumModel == null)
                return Result.Failure("Album not found");

            albumModel.Update(name, description);

            if (cover.Length > 0)
                await File.WriteAllBytesAsync(albumModel.Cover, cover);

            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<AlbumModel[]> GetAlbums(Guid userId)
        {
            AlbumModel[] albums = await _context.Albums.AsNoTracking()
                .Where(x => x.OwnerId == userId).ToArrayAsync();

            AlbumModel[] accessAlbums = await _context.AlbumAccess.AsNoTracking()
                .Where(x => x.UserId == userId)
                .Join(_context.Albums,
                    access => access.ItemId,
                    album => album.Id,
                    (access, album) => album).ToArrayAsync();

            return albums.Concat(accessAlbums).ToArray();
        }
    }
}