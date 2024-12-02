using Instend.Core.Models.Public;

namespace Instend.Core.Dependencies.Repositories.Account
{
    public interface IPublicationsRepository
    {
        Task<bool> DeleteAsync(Guid id, Guid ownerId);
        Task<Publication?> GetByIdAsync(Guid id);
    }
}