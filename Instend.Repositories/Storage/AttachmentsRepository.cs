using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Dependencies.Repositories.Storage;
using Instend.Core.Models.Storage;
using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Storage
{
    public class AttachmentsRepository<T> : IAttachmentsRepository<T> where T : LinkBase, new()
    {
        private readonly DatabaseContext _context = null!;

        private readonly DbSet<T> _links = null!;

        private readonly IFileService _fileService = null!;

        private readonly IPreviewService _previewService = null!;

        public AttachmentsRepository(IFileService fileService, DatabaseContext context, IPreviewService previewService)
        {
            _context = context;
            _links = context.Set<T>();
            _fileService = fileService;
            _previewService = previewService;
        }

        public async Task<AttachmentModel[]> GetItemAttachmentsAsync(Guid itemId)
        {
            AttachmentModel[] result = await _links.Where(x => x.ItemId == itemId)
                .Join(_context.Attachments,
                      link => link.LinkedItemId,
                      attachment => attachment.Id,
                      (x, attachmentModel) => attachmentModel)
                .ToArrayAsync() ?? [];

            foreach (var x in result)
            {
                await x.SetFile(_previewService);
            }

            return result;
        }

        public async Task<AttachmentModel?> GetByIdAsync(Guid id) 
            => await _context.Attachments.FirstOrDefaultAsync(x => x.Id == id);

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

        public async Task<Result<AttachmentModel[]>> AddAsync(IFormFile[] files, Guid userId, Guid itemId)
        {
            AttachmentModel[] attachments = new AttachmentModel[files.Length];

            for (int i = 0; i < files.Length; i++)
            {
                if (files[i].Length > 0)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await files[i].CopyToAsync(memoryStream);
                        byte[] fileBytes = memoryStream.ToArray();

                        string[] name = files[i].FileName.Split(".");

                        string? fileName = name.Length >= 1 ? name[0] : null;
                        string? fileType = name.Length >= 2 ? name[name.Length - 1] : null;

                        var attachment = await AddAsync
                        (
                            memoryStream.ToArray(),
                            fileName,
                            fileType,
                            files[i].Length,
                            userId,
                            itemId
                        );

                        if (attachment.IsSuccess)
                        {
                            attachments[i] = attachment.Value;
                            await attachments[i].SetFile(_previewService);

                        }
                    }
                }
            }

            return attachments;
        }

        public async Task<Result<AttachmentModel>> GetAttachmentAsync(Guid itemId, Guid id)
        {
            var result = await _links
                .Where(x => x.ItemId == itemId && x.LinkedItemId == id)
                .Join(_context.Attachments,
                    x => x.LinkedItemId,
                    y => y.Id,
                    (link, attachment) => attachment)
                .FirstOrDefaultAsync();

            if (result == null)
            {
                return Result.Failure<AttachmentModel>("");
            }

            return result;
        }
    }
}