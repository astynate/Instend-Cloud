using Instend.Core.Models.Storage.File;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Storage
{
    public class AttachmentsRepository : IAttachmentsRepository
    {
        private readonly GlobalContext _globalContext;

        public AttachmentsRepository(GlobalContext globalContext)
        {
            _globalContext = globalContext;
        }

        public async Task<Attachment?> GetAsync(Guid id)
        {
            return await _globalContext.Attachments
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}