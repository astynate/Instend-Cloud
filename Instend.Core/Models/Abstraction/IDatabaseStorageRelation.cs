using Instend.Services.External.FileService;

namespace Instend.Core.Models.Abstraction
{
    public interface IDatabaseStorageRelation
    {
        public void OnDelete(IFileService fileService);
    }
}