using Exider.Core.Models.Email;

namespace Exider.Repositories.Email
{
    public interface IConfirmationRespository
    {
        Task AddAsync(ConfirmationModel confirmation);
    }
}