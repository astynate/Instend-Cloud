using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Abstraction;

namespace Instend.Repositories.Storage
{
    public interface IAccessRepository
    {
        Task<Result> ChangeAccess<Item, Users>(List<AccessBase> prev, List<AccessBase> current, AccessItemBase item, Configuration.AccessTypes accessType, Guid accountId) where Item : AccessItemBase;
    }
}