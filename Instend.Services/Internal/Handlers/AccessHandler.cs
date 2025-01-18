using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
using CSharpFunctionalExtensions;
using Instend.Core.Models.Account;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Storage.Album;
using Microsoft.AspNetCore.Http;
using Instend.Repositories.Storage;

namespace Instend.Services.Internal.Handlers
{
    public class AccessHandler : IAccessHandler
    {
        private readonly IRequestHandler _requestHandler;

        private readonly ICollectionsRepository _collectionsRepository;

        private readonly IFilesRespository _filesRespository;

        private readonly IAccountsRepository _accountsRepository;

        public AccessHandler
        (
            IRequestHandler requestHandler, 
            IAccountsRepository accountRespotory, 
            ICollectionsRepository collectionsRepository, 
            IFilesRespository filesRespository
        )
        {
            _requestHandler = requestHandler;
            _accountsRepository = accountRespotory;
            _collectionsRepository = collectionsRepository;
            _filesRespository = filesRespository;
        }

        private Result GetAccessRequestResult(Configuration.EntityRoles accountRole, Configuration.EntityRoles operationLevel)
        {
            if (accountRole < operationLevel)
                return Result.Failure("You don't have rights to perform this operation");

            return Result.Success();
        }

        private AccessBase? GetAccountAccessFromList(IEnumerable<AccessBase> accountsWithAccesss, Account account)
            => accountsWithAccesss.FirstOrDefault(access => access.AccountId == account.Id);

        private Result<AccessBase> GetAccountAccess(IEnumerable<AccessBase> accountsWithAccess, Account account, Configuration.EntityRoles operationLevel)
        {
            var accountAccess = GetAccountAccessFromList(accountsWithAccess, account);

            if (accountAccess == null)
                return Result.Failure<AccessBase>("Account has no access to this item");

            var result = GetAccessRequestResult(accountAccess.Role, operationLevel);

            if (result.IsFailure)
                return Result.Failure<AccessBase>(result.Error);

            return accountAccess;
        }

        public async Task<Result<(Guid accountId, Core.Models.Storage.Collection.Collection? collection)>> GetAccountAccessToCollection(Guid? id, HttpRequest request, Configuration.EntityRoles operationLevel)
        {
            var accountId = _requestHandler.GetUserId(request.Headers["Authorization"]).Value;

            if (id != null && id.HasValue)
            {
                var account = await _accountsRepository
                    .GetByIdAsync(Guid.Parse(accountId));

                if (account == null)
                    return Result.Failure<(Guid accountId, Core.Models.Storage.Collection.Collection? collection)>("Account not found");

                var collection = await _collectionsRepository
                    .GetByIdAsync(id.Value);

                if (collection == null)
                    return Result.Failure<(Guid accountId, Core.Models.Storage.Collection.Collection? collection)>("ParentCollection not found");

                if (collection.Type == Configuration.CollectionTypes.System && operationLevel > Configuration.EntityRoles.Reader)
                    return Result.Failure<(Guid accountId, Core.Models.Storage.Collection.Collection? collection)>("You can't perform this operation on system collection.");

                var result = GetAccountAccess(collection.AccountsWithAccess, account, operationLevel);

                if (result.IsFailure)
                    return Result.Failure<(Guid accountId, Core.Models.Storage.Collection.Collection? collection)>(result.Error);

                return (account.Id, collection);
            }

            return (Guid.Parse(accountId), null);
        }

        public async Task<Result<(Guid accountId, Core.Models.Storage.File.File file)>> GetFileAccessRequestResult(Guid id, HttpRequest request, Configuration.EntityRoles operationLevel)
        {
            var accountId = _requestHandler
                .GetUserId(request.Headers["Authorization"]);

            var account = await _accountsRepository
                .GetByIdAsync(Guid.Parse(accountId.Value));

            var file = await _filesRespository.GetByIdAsync(id);

            if (file.IsFailure)
                return Result.Failure<(Guid accountId, Core.Models.Storage.File.File file)>("File not found");

            if (account == null)
                return Result.Failure<(Guid accountId, Core.Models.Storage.File.File file)>("Account not found");

            var result = await GetAccountAccessToCollection(file.Value.CollectionId, request, operationLevel);

            if (result.IsSuccess)
                return (account.Id, file.Value);


            return (account.Id, file.Value);
        } 

        public Result GetAlbumAccessRequestResult(Album album, Account account, Configuration.EntityRoles operationLevel)
            => GetAccountAccess(album.AccountsWithAccess, account, operationLevel);
    }
}