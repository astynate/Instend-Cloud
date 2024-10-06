using CSharpFunctionalExtensions;
using Exider.Core.Models.Links;
using Exider.Core.Models.Storage;
using Instend.Repositories.Storage;

namespace Exider.Repositories.Links
{
    public interface ILinkBaseRepository<Link> where Link : LinkBase, new()
    {
        Task<Result<FileModel>> AddFileToAlbum(Guid itemId, Guid linkedItemId);
        Task<LinkedItem[]?> GetLinkedItems<LinkedItem>(Guid itemId) where LinkedItem : DatabaseModelBase, new();
        Task<Result<FileModel>> UploadFileToAlbum(FileModel file, Guid albumId);
    }
}