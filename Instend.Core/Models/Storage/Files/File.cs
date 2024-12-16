using CSharpFunctionalExtensions;
using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;
using Instend.Core.Models.Access;

namespace Instend.Core.Models.Storage.File
{
    [Table("files")]
    public class File : AccessItemBase, IDatabaseStorageRelation
    {
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("creation_time")] public DateTime CreationTime { get; private set; }
        [Column("last_edit_time")] public DateTime LastEditTime { get; private set; }
        [Column("Path")] public string Path { get; private set; } = string.Empty;
        [Column("type")] public string? Type { get; private set; } = null;
        [Column("folder_id")] public Guid FolderId { get; private set; }
        [Column("size")] public double Size { get; private set; } = 0;

        [NotMapped] public byte[] Preview { get; private set; } = [];
        [NotMapped] public byte[] FileAsBytes { get; private set; } = [];

        public File() { }

        public static Result<File> Create(string name, string? type, double size, Guid ownerId, Guid folderId)
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
                FolderId = folderId
            });
        }

        public void Rename(string name) => Name = string.IsNullOrEmpty(name) == false &&
            string.IsNullOrWhiteSpace(name) == false ? name : Name;

        public async Task SetPreview(IPreviewService previewService)
        {
            var result = await previewService.GetPreview(Type, Path);

            if (result.IsSuccess)
                Preview = result.Value;
        }

        public void OnDelete(IFileService fileService) => fileService.DeleteFile(Path);
    }
}