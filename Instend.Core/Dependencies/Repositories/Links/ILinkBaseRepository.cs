using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Storage.File;

namespace Instend.Repositories.Links
{
    public interface ILinkBaseRepository<Link> where Link : LinkBase, new()
    {
        Task<Result<Core.Models.Storage.File.File>> AddFileToAlbum(Guid itemId, Guid linkedItemId);
        Task<LinkedItem[]?> GetLinkedItems<LinkedItem>(Guid itemId) where LinkedItem : DatabaseModel, new();
        Task<Result<Core.Models.Storage.File.File>> UploadFileToAlbum(Core.Models.Storage.File.File file, Guid albumId);
    }
}