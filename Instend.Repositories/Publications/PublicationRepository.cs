using CSharpFunctionalExtensions;
using CSharpFunctionalExtensions.ValueTasks;
using Instend.Core;
using Instend.Core.Dependencies.Repositories.Storage;
using Instend.Core.Models.Storage;
using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Public;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Comments
{
    public class PublicationRepository<Publication, Attachment> : IPublicationRepository<Publication, Attachment>
        where Publication : LinkBase, new()
        where Attachment : LinkBase, new()
    {
        private readonly DatabaseContext _context;

        private readonly DbSet<Publication> _entities;

        private readonly DbSet<Attachment> _links;

        private readonly IFileService _fileService;

        private readonly IPreviewService _previewService;

        private readonly IAttachmentsRepository<Attachment> _attachmentsRepository;

        private readonly IPublicationBaseRepository<Attachment> _commentBaseRepository;

        public PublicationRepository
        (
            DatabaseContext context,
            IFileService fileService,
            IPreviewService previewService,
            IAttachmentsRepository<Attachment> attachmentsRepository,
            IPublicationBaseRepository<Attachment> commentBaseRepository
        )
        {
            _context = context;
            _entities = context.Set<Publication>();
            _links = context.Set<Attachment>();
            _fileService = fileService;
            _attachmentsRepository = attachmentsRepository;
            _previewService = previewService;
            _commentBaseRepository = commentBaseRepository;
        }

        public async Task<object[]> GetLastCommentsAsync(Guid[] id, DateTime lastPublictionTime, int count, Guid userId)
        {
            return await GetPersonalPublictions(id, lastPublictionTime, count, userId);
        }

        public async Task<Result<PublicationModel>> AddComment(string text, IFormFile[] files, Guid ownerId, Guid albumId)
        {
            return null;
        }

        public async Task<Result<AttachmentModel>> GetAttachmentAsync(Guid itemId, Guid attachmentId)
        {
            Attachment? model = await _links.FirstOrDefaultAsync(x => x.ItemId == itemId && x.LinkedItemId == attachmentId);

            if (model == null)
                return Result.Failure<AttachmentModel>("Atachment not found");

            AttachmentModel? attachment = await _attachmentsRepository.GetByIdAsync(model.LinkedItemId);

            if (attachment == null)
                return Result.Failure<AttachmentModel>("Atachment not found");

            return attachment;
        }

        private async Task<object[]> GetPersonalPublictions(Guid[] id, DateTime lastPublictionTime, int count, Guid userId)
        {
            return [];
        }
    }
}