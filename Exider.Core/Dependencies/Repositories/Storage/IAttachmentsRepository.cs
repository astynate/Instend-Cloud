using CSharpFunctionalExtensions;
using Exider.Core.Models.Storage;

namespace Exider.Core.Dependencies.Repositories.Storage
{
    public interface IAttachmentsRepository
    {
        Task<Result<AttachmentModel>> AddAsync(string name, string path, string? type, ulong size, Guid userId);
    }
}