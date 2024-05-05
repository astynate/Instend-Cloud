using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Gallery;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Gallery
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly DatabaseContext _context = null!;

        public AlbumRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Result<AlbumModel>> AddAsync(Guid ownerId, byte[] cover, string name, string? description)
        {
            var albumModel = AlbumModel.Create(name, DateTime.Now, DateTime.Now, ownerId, Configuration.AccessTypes.Private);

            if (albumModel.IsFailure)
            {
                return Result.Failure<AlbumModel>(albumModel.Error);
            }

            await File.WriteAllBytesAsync(albumModel.Value.Cover, cover);

            await _context.AddAsync(albumModel.Value);
            await _context.SaveChangesAsync();

            return Result.Success(albumModel.Value);
        }

        public async Task<Result<AlbumModel[]>> GetAlbums(IImageService imageService, Guid userId)
        {
            AlbumModel[] albums =  await _context.Albums.AsNoTracking()
                .Where(x => x.OwnerId == userId).ToArrayAsync();

            foreach (AlbumModel album in albums)
            {
                await album.SetCover(imageService);
            }

            return Result.Success<AlbumModel[]>(albums);
        }

        public async Task<Result> AddPhotoToAlbum(Guid fileId, Guid albumId)
        {
            var result = AlbumLink.Create(albumId, fileId);

            if (result.IsFailure)
            {
                return Result.Failure(result.Error);
            }

            await _context.AlbumLinks.AddAsync(result.Value);
            await _context.SaveChangesAsync();

            return Result.Success();
        }
    }
}