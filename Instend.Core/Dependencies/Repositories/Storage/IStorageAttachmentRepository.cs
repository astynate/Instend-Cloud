using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage.Collection;
using Instend.Core.Models.Storage.File;

namespace Instend.Repositories.Storage
{
    public interface IStorageAttachmentRepository
    {
        Task<Result<(Collection[] folders, Core.Models.Storage.File.File[] files)>> AddStorageMessageLinks(Guid[] folderIds, Guid[] fileIds, Guid messageId, string bearer);
    }
}