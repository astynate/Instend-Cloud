using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Public;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Comments
{
    public class PublicationBaseRepository<AttachmentLink> : IPublicationBaseRepository<AttachmentLink> where AttachmentLink : LinkBase, new()
    {
        private readonly AccountsContext _accountsContext;

        private readonly PublicationsContext _publicationsContext;

        private readonly DbSet<AttachmentLink> _links;

        public PublicationBaseRepository(AccountsContext context, PublicationsContext publicationsContext)
        {
            _accountsContext = context;
            _links = context.Set<AttachmentLink>();
            _publicationsContext = publicationsContext;
        }

        public async Task<Publication?> GetByIdAsync(Guid id)
            => await _publicationsContext.Publications.FirstOrDefaultAsync(c => c.Id == id);

        public async Task<Result> DeleteAsync(Guid id)
        {
            var publication = await _publicationsContext.Publications
                .FirstOrDefaultAsync(c => c.Id == id);

            if (publication == null)
                return Result.Failure("Publication is not found");

            await _publicationsContext.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<bool> IsUserLikedPubliction(Guid userId, Guid publictionId)
        {
            var reaction = await _publicationsContext.PublicationReactions
                .FirstOrDefaultAsync(x => x.ItemId == publictionId && x.LinkedItemId == userId);

            return reaction != null;
        }
    }
}