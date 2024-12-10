using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Account;
using Instend.Core.Models.Storage.Album;
using Instend.Core.Models.Storage.Collection;

namespace Instend.Services.Internal.Handlers
{
    public interface IAccessHandler
    {
        Result GetAlbumAccessRequestResult(Album album, Account account, Configuration.EntityRoles operationLevel);
        Result GetCollectionAccessRequestResult(Collection collection, Account account, Configuration.EntityRoles operationLevel);
        Result GetFileAccessRequestResult(Core.Models.Storage.File.File file, Account account, Configuration.EntityRoles operationLevel);
    }
}