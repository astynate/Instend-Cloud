using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;

namespace Instend.Repositories.Comments
{
    public class PublicationRepository<Publication, Attachment> : IPublicationRepository<Publication, Attachment>
        where Publication : LinkBase, new()
        where Attachment : LinkBase, new()
    {
        private readonly AccountsContext _context;

        private readonly DbSet<Publication> _entities;

        private readonly DbSet<Attachment> _links;

        private readonly IFileService _fileService;

        private readonly IPreviewService _previewService;

        private readonly IPublicationBaseRepository<Attachment> _commentBaseRepository;

        public PublicationRepository
        (
            AccountsContext context,
            IFileService fileService,
            IPreviewService previewService,
            IPublicationBaseRepository<Attachment> commentBaseRepository
        )
        {
            _context = context;
            _entities = context.Set<Publication>();
            _links = context.Set<Attachment>();
            _fileService = fileService;
            _previewService = previewService;
            _commentBaseRepository = commentBaseRepository;
        }

        //public async Task<Result<AttachmentModel>> GetAttachmentAsync(Guid itemId, Guid attachmentId)
        //{
        //    //var model = await _links.FirstOrDefaultAsync(x => x.ItemId == itemId && x.LinkedItemId == attachmentId);

        //    //if (model == null)
        //    //    return Result.Failure<AttachmentModel>("Atachment not found");

        //    //var attachment = await _attachmentsRepository.GetByIdAsync(model.LinkedItemId);

        //    //if (attachment == null)
        //    //    return Result.Failure<AttachmentModel>("Atachment not found");

        //    //return attachment;
        //}
    }
}