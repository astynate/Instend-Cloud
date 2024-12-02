using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Storage.Collection;
using Instend.Core.Models.Storage.File;

namespace Instend.Services.Internal.Handlers
{
    public interface IAccessHandler
    {
        Task<Result> GetAccessStateAsync(Core.Models.Storage.File.File file, Configuration.EntityRoles operation, string? bearer);
        Task<Result> GetAccessStateAsync(Collection folder, Configuration.EntityRoles operation, string bearer);
    }
}