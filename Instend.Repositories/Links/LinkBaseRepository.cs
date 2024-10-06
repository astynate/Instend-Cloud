using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Links;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;
using Instend.Repositories.Storage;
using Microsoft.EntityFrameworkCore;
using static Exider.Core.Models.Links.AlbumLinks;

namespace Exider.Repositories.Links
{
    public class LinkBaseRepository<Link> : ILinkBaseRepository<Link> where Link : LinkBase, new()
    {
        private readonly DatabaseContext _context = null!;

        private readonly IPreviewService _previewService = null!;

        private readonly DbSet<Link> _entities = null!;

        public LinkBaseRepository(DatabaseContext context, IPreviewService previewService)
        {
            _context = context;
            _entities = context.Set<Link>();
            _previewService = previewService;
        }

        public async Task<LinkedItem[]?> GetLinkedItems<LinkedItem>(Guid itemId) where LinkedItem : DatabaseModelBase, new()
        {
            var links = _context.Set<Link>();
            var items = _context.Set<LinkedItem>();

            var result = await links
                .Where(x => x.ItemId == itemId)
                .Join(items,
                    link => link.LinkedItemId,
                    item => item.Id,
                    (link, item) => item)
                .ToArrayAsync();

            return result;
        }

        public async Task<Result<FileModel>> AddFileToAlbum(Guid itemId, Guid linkedItemId)
        {
            AlbumLink? link = await _context.AlbumLinks.FirstOrDefaultAsync(x => x.LinkedItemId == linkedItemId && x.ItemId == itemId);

            if (link != null)
            {
                return Result.Failure<FileModel>("Photo are already exist in this album");
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

            await file.SetPreview(_previewService);

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
