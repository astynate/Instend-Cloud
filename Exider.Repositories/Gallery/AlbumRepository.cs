using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Gallery;
using Exider.Core.Models.Storage;
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
            var albumModel = AlbumModel.Create(name, description, DateTime.Now, DateTime.Now, ownerId, Configuration.AccessTypes.Private);

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

        public async Task<Result<FileModel>> AddPhotoToAlbum(Guid fileId, Guid albumId)
        {
            FileModel[]? files = await _context.AlbumLinks
                .Where(x => x.FileId == fileId && x.AlbumId == albumId)
                .Join(_context.Files,
                      albumLink => albumLink.FileId,
                      file => file.Id,
                      (albumLink, file) => file)
                .ToArrayAsync();

            if (files.Length > 0)
            {
                return Result.Success(files[0]);
            }

            FileModel? file = await _context.Files
                .FirstOrDefaultAsync(x => x.Id == fileId);

            if (file == null)
            {
                return Result.Failure<FileModel>("File not found");
            }

            var result = AlbumLink.Create(albumId, fileId);

            if (result.IsFailure)
            {
                return Result.Failure<FileModel>(result.Error);
            }

            await _context.AlbumLinks.AddAsync(result.Value);
            await _context.SaveChangesAsync();

            return Result.Success(file);
        }

        public async Task<Result> DeleteAlbumAsync(Guid id, Guid userId)
        {
            AlbumModel? album = await _context.Albums
                .FirstOrDefaultAsync(x => x.Id == id);

            if (album == null)
            {
                return Result.Failure("Album not found");
            }
            
            int result = await _context.Albums.Where(x => x.Id == id)
                .ExecuteDeleteAsync();

            if (result == 0)
            {
                return Result.Failure("Album not found");
            }

            File.Delete(album.Cover);

            return Result.Success();
        }
    }
}