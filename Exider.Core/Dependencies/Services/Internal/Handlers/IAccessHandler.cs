using Exider.Core.Models.Storage;

namespace Exider.Services.Internal.Handlers
{
    public interface IAccessHandler
    {
        Task<bool> GetAccessStateAsync(FileModel file, string bearer);
        Task<bool> GetAccessStateAsync(FolderModel folder, string bearer);
    }
}