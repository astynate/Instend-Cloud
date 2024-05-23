using CSharpFunctionalExtensions;
using Exider.Core.Models.Links;
using Exider.Core.Models.Storage;

namespace Exider.Repositories.Links
{
    public interface ILinkBaseRepository<Link> where Link : LinkBase, new()
    {
        Task<Result<FileModel>> AddFileToAlbum(Guid itemId, Guid linkedItemId);
        Task<Result<FileModel>> UploadFileToAlbum(FileModel file, Guid albumId);
    }
}