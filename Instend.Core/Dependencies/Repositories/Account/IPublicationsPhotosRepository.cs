using Instend.Core.Models.Storage.File;

namespace Instend.Repositories.Publications
{
    public interface IPublicationsPhotosRepository
    {
        Task<List<Attachment>> GetAccountPhotos(Guid accountId, int skip);
    }
}