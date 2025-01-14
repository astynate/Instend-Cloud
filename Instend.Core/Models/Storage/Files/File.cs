using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Storage.Album;
using Instend.Core.Models.Storage.Files;
using Instend.Services.External.FileService;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Storage.File
{
    [Table("files")]
    public class File : AccessItemBase, IDatabaseStorageRelation
    {
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("creation_time")] public DateTime CreationTime { get; private set; }
        [Column("last_edit_time")] public DateTime LastEditTime { get; private set; }
        [Column("path")] public string Path { get; private set; } = string.Empty;
        [Column("type")] public string? Type { get; private set; } = null;
        [Column("collection_id")] public Guid CollectionId { get; private set; }
        [Column("size")] public double Size { get; private set; } = 0;

        public List<FileAccount> AccountsWithAccess { get; init; } = [];

        private File() { }

        public static Result<File> Create(string name, string? type, double size, Guid ownerId, Guid collectionId)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrEmpty(name))
                return Result.Failure<File>("Invalid folder name");

            if (ownerId == Guid.Empty)
                return Result.Failure<File>("Invalid ownder id");

            var id = Guid.NewGuid();
            var path = Configuration.GetAvailableDrivePath() + id;

            return Result.Success(new File()
            {
                Id = id,
                Name = name,
                CreationTime = DateTime.Now,
                LastEditTime = DateTime.Now,
                Size = size,
                Path = path,
                Type = type,
                CollectionId = collectionId
            });
        }

        public void Rename(string name) {}
        public void OnDelete(IFileService fileService) => fileService.DeleteFile(Path);
    }
}