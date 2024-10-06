using CSharpFunctionalExtensions;
using Exider.Core.Models.Storage;

namespace Instend.Repositories.Storage
{
    public interface IStorageAttachmentRepository
    {
        Task<Result<(FolderModel[] folders, FileModel[] files)>> AddStorageMessageLinks(Guid[] folderIds, Guid[] fileIds, Guid messageId, string bearer);
    }
}