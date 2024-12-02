using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;
using CSharpFunctionalExtensions;
using Instend.Core.Models.Public;
using Instend.Core.Dependencies.Repositories.Account;

namespace Instend.Repositories.Comments
{
    public class PublicationsRepository : IPublicationsRepository
    {
        private readonly PublicationsContext _publicationsContext;

        private readonly IFileService _fileService;

        private readonly IPreviewService _previewService;

        public PublicationsRepository
        (
            PublicationsContext publicationsContext,
            IFileService fileService,
            IPreviewService previewService
        )
        {
            _publicationsContext = publicationsContext;
            _fileService = fileService;
            _previewService = previewService;
        }

        public async Task<Publication?> GetByIdAsync(Guid id)
        {
            var publication = await _publicationsContext.Publications
                .AsNoTracking()
                .Where(c => c.Id == id)
                .Include(x => x.Attechments)
                .FirstOrDefaultAsync();

            return publication;
        }

        public async Task<bool> DeleteAsync(Guid id, Guid ownerId)
        {
            var result = await _publicationsContext.Publications
                .Where(p => p.Id == id && p.AccountId == ownerId)
                .ExecuteDeleteAsync();

            await _publicationsContext.SaveChangesAsync();

            return result > 0;
        }
    }
}