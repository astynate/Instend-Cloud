using Instend.Core;
using Instend.Core.Models.Storage.File;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Publications
{
    public class PublicationsPhotosRepository : IPublicationsPhotosRepository
    {
        private readonly GlobalContext _context;

        public PublicationsPhotosRepository(GlobalContext context)
        {
            _context = context;
        }

        public async Task<List<Attachment>> GetAccountPhotos(Guid accountId, int skip)
        {
            return await _context.Publications
                .AsNoTracking()
                .Include(x => x.Attachments)
                .Where(x => x.AccountId == accountId && x.Attachments.FirstOrDefault(x => Configuration.imageTypes.Contains(x.Type)) != null)
                .Skip(skip)
                .Take(9)
                .SelectMany(x => x.Attachments)
                .ToListAsync();
        }
    }
}