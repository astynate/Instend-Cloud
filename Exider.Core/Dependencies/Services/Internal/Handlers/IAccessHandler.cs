using Exider.Core.Models.Storage;

namespace Exider.Services.Internal.Handlers
{
    public interface IAccessHandler
    {
        Task<bool> GetFileAccessStateAsync(FileModel file, string bearer);
        Task<bool> GetFileAccessStateAsync(FolderModel folder, string bearer);
    }
}