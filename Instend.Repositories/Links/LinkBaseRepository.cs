using CSharpFunctionalExtensions;
using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Storage.File;

namespace Instend.Repositories.Links
{
    public class LinkBaseRepository<Link> : ILinkBaseRepository<Link> where Link : LinkBase, new()
    {
        private readonly AccountsContext _accountContext = null!;

        private readonly StorageContext _storageContext = null!;

        private readonly IPreviewService _previewService = null!;

        private readonly DbSet<Link> _entities = null!;

        public LinkBaseRepository(AccountsContext accountContext, StorageContext storageContext, IPreviewService previewService)
        {
            _accountContext = accountContext;
            _storageContext = storageContext;
            _entities = accountContext.Set<Link>();
            _previewService = previewService;
        }

        public async Task<LinkedItem[]?> GetLinkedItems<LinkedItem>(Guid itemId) where LinkedItem : DatabaseModel, new()
        {
            var links = _storageContext.Set<Link>();
            var items = _storageContext.Set<LinkedItem>();

            var result = await links
                .Where(x => x.ItemId == itemId)
                .Join(items,
                    link => link.LinkedItemId,
                    item => item.Id,
                    (link, item) => item)
                .ToArrayAsync();

            return result;
        }

        public async Task<Result<Core.Models.Storage.File.File>> AddFileToAlbum(Guid itemId, Guid linkedItemId)
        {
            var link = await _storageContext.AlbumFiles.FirstOrDefaultAsync(x => x.LinkedItemId == linkedItemId && x.ItemId == itemId);

            if (link != null)
                return Result.Failure<File>("Photo are already exist in this album");

            var file = await _storageContext.Files
                .FirstOrDefaultAsync(x => x.Id == linkedItemId);

            if (file == null)
                return Result.Failure<File>("File not found");

            var result = LinkBase.Create<Link>(itemId, linkedItemId);

            if (result.IsFailure)
                return Result.Failure<File>(result.Error);

            await file.SetPreview(_previewService);

            await _entities.AddAsync(result.Value);
            await _storageContext.SaveChangesAsync();

            return Result.Success(file);
        }

        public async Task<Result<Core.Models.Storage.File.File>> UploadFileToAlbum(Core.Models.Storage.File.File file, Guid albumId)
        {
            var result = LinkBase.Create<Link>(albumId, file.Id);

            if (result.IsFailure)
                return Result.Failure<File>(result.Error);

            await _entities.AddAsync(result.Value);
            await _storageContext.SaveChangesAsync();

            return Result.Success(file);
        }
    }
}
