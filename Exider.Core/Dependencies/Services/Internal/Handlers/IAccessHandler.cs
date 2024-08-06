using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Storage;

namespace Exider.Services.Internal.Handlers
{
    public interface IAccessHandler
    {
        Task<Result> GetAccessStateAsync(FileModel file, Configuration.Abilities operation, string? bearer);
        Task<Result> GetAccessStateAsync(FolderModel folder, Configuration.Abilities operation, string bearer);
    }
}