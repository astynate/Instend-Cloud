using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage;
using Instend.Core.Models.Abstraction;

namespace Instend.Repositories.Links
{
    public interface ILinkBaseRepository<Link> where Link : LinkBase, new()
    {
        Task<Result<FileModel>> AddFileToAlbum(Guid itemId, Guid linkedItemId);
        Task<LinkedItem[]?> GetLinkedItems<LinkedItem>(Guid itemId) where LinkedItem : DatabaseModelBase, new();
        Task<Result<FileModel>> UploadFileToAlbum(FileModel file, Guid albumId);
    }
}