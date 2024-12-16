using Instend.Core.Models.Abstraction;
using Instend.Services.External.FileService;

namespace Instend.Core.Models.Public
{
    public class Reaction : IDatabaseStorageRelation
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Name { get; private set; } = string.Empty;
        public string Path { get; private set; } = string.Empty;

        private Reaction() { }

        public void OnDelete(IFileService fileService) => fileService.DeleteFile(Path);
    }
}