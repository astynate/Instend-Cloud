using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Dependencies.Repositories.Storage;
using Exider.Core.Models.Links;
using Exider.Core.Models.Storage;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Storage
{
    public class AttachmentsRepository<T> : IAttachmentsRepository<T> where T : LinkBase, new()
    {
        private readonly DatabaseContext _context = null!;

        private readonly DbSet<T> _links = null!;

        private readonly IFileService _fileService = null!;

        public AttachmentsRepository(IFileService fileService, DatabaseContext context)
        {
            _context = context;
            _links = context.Set<T>();
            _fileService = fileService;
        }

        public async Task<Result<AttachmentModel>> AddAsync(byte[] file, string name, string? type, long size, Guid userId, Guid itemId)
        {
            var result = AttachmentModel.Create(name, type, size, userId);

            if (result.IsFailure)
                return result;

            var link = LinkBase.Create<T>(itemId, result.Value.Id);

            if (link.IsFailure)
                return Result.Failure<AttachmentModel>(link.Error);

            await _context.AddAsync(result.Value);
            await _context.SaveChangesAsync();

            await _links.AddAsync(link.Value);
            await _context.SaveChangesAsync();

            await _fileService.WriteFileAsync(result.Value.Path, file);
            return result.Value;
        }
    }
}