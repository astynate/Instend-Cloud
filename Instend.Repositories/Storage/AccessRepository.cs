using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Abstraction;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Storage
{
    public class AccessRepository : IAccessRepository
    {
        private readonly GlobalContext _context;

        public AccessRepository(GlobalContext context)
        {
            _context = context;
        }

        private async Task UpdateRoles<Users>(List<Users> prev, List<Users> current) where Users : AccessBase
        {
            var prevAccountIds = prev.Select(x => x.AccountId);
            var currentAccountIds = current.Select(x => x.AccountId);

            var rolesToUpdate = prev.Where(x => currentAccountIds.Contains(x.AccountId));
            var rolesToAdd = current.Where(x => !prevAccountIds.Contains(x.AccountId));
            var rolesToDelete = prev.Where(x => !currentAccountIds.Contains(x.AccountId));

            foreach (var prevRole in rolesToUpdate)
            {
                foreach (var currentRole in current)
                {
                    if (currentRole.AccountId == prevRole.AccountId)
                    {
                        prevRole.Role = currentRole.Role;
                    }
                }
            }

            _context.RemoveRange(rolesToDelete);

            await _context.AddRangeAsync(rolesToAdd);
            await _context.SaveChangesAsync();
        }

        public async Task<Result> ChangeAccess<Item, Users>
        (
            List<Users> prev,
            List<Users> current,
            AccessItemBase item,
            Configuration.AccessTypes accessType,
            Guid accountId
        )
            where Item : AccessItemBase
            where Users : AccessBase
        {
            if (current.Count() > 30)
                return Result.Failure("The maximum value of participans is 30.");

            if (current.Count() < 1)
                return Result.Failure("Item should contain at leas one owner.");

            var owners = prev
                .Where(x => x.Role == Configuration.EntityRoles.Owner)
                .Select(x => x.AccountId);

            if (owners.Contains(accountId) == false)
                return Result.Failure("Only owners can control access to this item.");

            return await _context.Database.CreateExecutionStrategy().ExecuteAsync(async Task<Result> () =>
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    await UpdateRoles(prev, current);

                    _context.Attach(item);

                    item.Access = accessType;

                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return Result.Success();
                }
            });
        }
    }
}