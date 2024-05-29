using CSharpFunctionalExtensions;
using Exider.Core.Dependencies.Repositories.Messenger;
using Exider.Core.Models.Messenger;

namespace Exider.Repositories.Messenger
{
    public interface IDirectRepository : IChatBase
    {
        Task<Result<DirectModel>> CreateNewDiret(Guid userId, Guid ownerId);
    }
}