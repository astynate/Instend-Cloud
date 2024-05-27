using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Albums;
using Exider.Core.Models.Links;
using Exider.Repositories.Gallery;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Storage
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly DatabaseContext _context = null!;

        public AlbumRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Result<AlbumModel>> AddAsync(Guid ownerId, byte[] cover, string name, string? description, Configuration.AlbumTypes type)
        {
            var albumModel = AlbumModel.Create(name, description, DateTime.Now, DateTime.Now, ownerId, type, Configuration.AccessTypes.Private);

            if (albumModel.IsFailure)
            {
                return Result.Failure<AlbumModel>(albumModel.Error);
            }

            await File.WriteAllBytesAsync(albumModel.Value.Cover, cover);

            await _context.AddAsync(albumModel.Value);
            await _context.SaveChangesAsync();

            return Result.Success(albumModel.Value);
        }

        public async Task<Result<AlbumModel[]>> GetAlbums(IImageService imageService, Guid userId, Configuration.AlbumTypes type)
        {
            AlbumModel[] albums = await _context.Albums.AsNoTracking()
                .Where(x => x.OwnerId == userId && x.TypeId == type.ToString()).ToArrayAsync();

            foreach (AlbumModel album in albums)
            {
                await album.SetCover(imageService);
            }

            return Result.Success(albums);
        }

        public async Task<Result<AlbumModel>> DeleteAlbumAsync(Guid id, Guid userId)
        {
            AlbumModel? album = await _context.Albums
                .FirstOrDefaultAsync(x => x.Id == id);

            if (album == null)
            {
                return Result.Failure<AlbumModel>("Album not found");
            }

            if (album.OwnerId != userId)
            {
                return Result.Failure<AlbumModel>("Only owners can delete an album.");
            }

            int result = await _context.Albums.Where(x => x.Id == id)
                .ExecuteDeleteAsync();

            if (result == 0)
            {
                return Result.Failure<AlbumModel>("Album not found");
            }

            File.Delete(album.Cover);

            return Result.Success(album);
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
            {
                return Result.Failure("Album not found");
            }

            albumModel.Update(name, description);

            if (cover.Length > 0)
            {
                await File.WriteAllBytesAsync(albumModel.Cover, cover);
            }

            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<AlbumModel[]> GetAlbums(Guid userId)
        {
            return await _context.Albums.AsNoTracking()
                .Where(x => x.OwnerId == userId).ToArrayAsync();
        }

        public async Task<Result<long>> ViewAlbumWithUserId(Guid albumId, Guid userId)
        {
            var isViewExistRequest = await _context.Albums
                .Where(x => x.Id == albumId)
                .GroupJoin(_context.ViewsLinks,
                    albums => albums.Id,
                    links => links.ItemId,
                    (album, link) => new { Album = album, Link = link })
                .ToArrayAsync();

            if (isViewExistRequest.Length >= 0)
            {
                AlbumModel album = isViewExistRequest[0].Album;
                AlbumViewLink[] links = isViewExistRequest[0].Link.ToArray();

                if (album.OwnerId == userId)
                {
                    return -1;
                }

                if (links.Length > 0)
                {
                    return -1;
                }

                var link = LinkBase.Create<AlbumViewLink>(albumId, userId);

                if (link.IsFailure)
                {
                    return Result.Failure<long>(link.Error);
                }

                album.IncrementViews();

                await _context.ViewsLinks.AddAsync(link.Value);
                await _context.SaveChangesAsync();
                
                return album.Views;
            }

            return -1;
        }
    }
}