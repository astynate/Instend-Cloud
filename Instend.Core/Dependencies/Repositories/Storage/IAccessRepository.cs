using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Abstraction;

namespace Instend.Repositories.Storage
{
    public interface IAccessRepository
    {
        Task<Result> ChangeAccess<Item, Users>(List<Users> prev, List<Users> current, AccessItemBase item, Configuration.AccessTypes accessType, Guid accountId) 
            where Item : AccessItemBase
            where Users : AccessBase;
    }
}