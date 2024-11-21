using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage;
using Instend.Core.Models.Abstraction;
using Microsoft.AspNetCore.Http;

namespace Instend.Core.Dependencies.Repositories.Storage
{
    public interface IAttachmentsRepository<T> where T : LinkBase, new()
    {
        Task<Result<AttachmentModel>> AddAsync(byte[] file, string name, string? type, long size, Guid userId, Guid itemId);
        Task<Result<AttachmentModel[]>> AddAsync(IFormFile[] files, Guid userId, Guid itemId);
        Task<AttachmentModel?> GetByIdAsync(Guid id);
        Task<Result<AttachmentModel>> GetAttachmentAsync(Guid itemId, Guid id);
        Task<AttachmentModel[]> GetItemAttachmentsAsync(Guid itemId);
    }
}