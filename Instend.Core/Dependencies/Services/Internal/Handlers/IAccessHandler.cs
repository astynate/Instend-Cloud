using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Storage;

namespace Instend.Services.Internal.Handlers
{
    public interface IAccessHandler
    {
        Task<Result> GetAccessStateAsync(FileModel file, Configuration.Abilities operation, string? bearer);
        Task<Result> GetAccessStateAsync(FolderModel folder, Configuration.Abilities operation, string bearer);
    }
}