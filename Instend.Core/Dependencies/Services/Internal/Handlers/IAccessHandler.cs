using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Account;
using Instend.Core.Models.Storage.Album;
using Instend.Core.Models.Storage.Collection;
using Microsoft.AspNetCore.Http;

namespace Instend.Services.Internal.Handlers
{
    public interface IAccessHandler
    {
        Result GetAlbumAccessRequestResult(Album album, Account account, Configuration.EntityRoles operationLevel);
        Task<Result<(Guid accountId, Collection? collection)>> GetAccountAccessToCollection(Guid? id, HttpRequest request, Configuration.EntityRoles operationLevel);
        Task<Result<(Guid accountId, Core.Models.Storage.File.File file)>> GetFileAccessRequestResult(Guid id, HttpRequest request, Configuration.EntityRoles operationLevel);
    }
}