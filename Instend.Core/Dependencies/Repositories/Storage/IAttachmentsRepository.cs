using Instend.Core.Models.Storage.File;

namespace Instend.Repositories.Storage
{
    public interface IAttachmentsRepository
    {
        Task<Attachment?> GetAsync(Guid id);
    }
}