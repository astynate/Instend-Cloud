using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Links;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;
using static Exider.Core.Models.Links.AlbumLinks;
namespace Exider.Repositories.Links
{
    public class LinkBaseRepository<Link> : ILinkBaseRepository<Link> where Link : LinkBase, new()
    {
        private readonly DatabaseContext _context = null!;

        private readonly IFileService _fileService = null!;

        private readonly DbSet<Link> _entities = null!;

        public LinkBaseRepository(DatabaseContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
            _entities = context.Set<Link>();
        }

        public async Task<Result<FileModel>> AddFileToAlbum(Guid itemId, Guid linkedItemId)
        {
            AlbumLink? link = await _context.AlbumLinks.FirstOrDefaultAsync(x => x.LinkedItemId == linkedItemId && x.ItemId == itemId);

            if (link != null)
            {
                return Result.Failure<FileModel>("Photo are alredy exist in this album");
            }

            FileModel? file = await _context.Files
                .FirstOrDefaultAsync(x => x.Id == linkedItemId);

            if (file == null)
            {
                return Result.Failure<FileModel>("File not found");
            }

            var result = LinkBase.Create<Link>(itemId, linkedItemId);

            if (result.IsFailure)
            {
                return Result.Failure<FileModel>(result.Error);
            }

            await file.SetPreview(_fileService);

            await _entities.AddAsync(result.Value);
            await _context.SaveChangesAsync();

            return Result.Success(file);
        }

        public async Task<Result<FileModel>> UploadFileToAlbum(FileModel file, Guid albumId)
        {
            var result = LinkBase.Create<Link>(albumId, file.Id);

            if (result.IsFailure)
            {
                return Result.Failure<FileModel>(result.Error);
            }

            await _entities.AddAsync(result.Value);
            await _context.SaveChangesAsync();

            return Result.Success(file);
        }
    }
}
