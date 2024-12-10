using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage.Collection;
using Instend.Core.Models.Account;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Storage.Album;

namespace Instend.Services.Internal.Handlers
{
    public class AccessHandler : IAccessHandler
    {
        private readonly IRequestHandler _requestHandler;

        private readonly IAccountsRepository _accountsRepository;

        public AccessHandler(IRequestHandler requestHandler, IAccountsRepository accountRespotory)
        {
            _requestHandler = requestHandler;
            _accountsRepository = accountRespotory;
        }

        private Result GetAccessRequestResult(Configuration.EntityRoles accountRole, Configuration.EntityRoles operationLevel)
        {
            if (accountRole < operationLevel)
                return Result.Failure("You don't have rights to perform this operation");

            return Result.Success();
        }

        private AccessBase? GetAccountAccessFromList(IEnumerable<AccessBase> accountsWithAccesss, Account account)
            => accountsWithAccesss.FirstOrDefault(access => access.Account?.Id == account.Id);

        private Result<AccessBase> GetAccountAccess(AccessItemBase accessItemBase, Account account, Configuration.EntityRoles operationLevel)
        {
            var accountAccess = GetAccountAccessFromList(accessItemBase.AccountsWithAccess, account);

            if (accountAccess == null)
                return Result.Failure<AccessBase>("Account has no access to this item");

            var result = GetAccessRequestResult(accountAccess.Role, operationLevel);

            if (result.IsFailure)
                return Result.Failure<AccessBase>(result.Error);

            return accountAccess;
        }

        public Result GetCollectionAccessRequestResult(Collection collection, Account account, Configuration.EntityRoles operationLevel)
        {
            if (collection.Type == Configuration.CollectionTypes.System && operationLevel > Configuration.EntityRoles.Reader)
                return Result.Failure("You can't perform this operation on system collection.");

            return GetAccountAccess(collection, account, operationLevel);
        }

        public Result GetFileAccessRequestResult(Core.Models.Storage.File.File file, Account account, Configuration.EntityRoles operationLevel)
            => GetAccountAccess(file, account, operationLevel);

        public Result GetAlbumAccessRequestResult(Album album, Account account, Configuration.EntityRoles operationLevel)
            => GetAccountAccess(album, account, operationLevel);
    }
}