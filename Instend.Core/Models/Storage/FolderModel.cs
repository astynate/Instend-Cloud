using CSharpFunctionalExtensions;
using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Storage
{
    public class FolderModel : AccessItemBase
    {
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("creation_time")] public DateTime CreationTime { get; private set; }
        [Column("folder_id")] public Guid FolderId { get; private set; }
        [NotMapped] public List<FileModel> Preview { get; private set; } = new();
        [Column("visibility")] public bool Visibility { get; private set; } = true;
        [Column("type")] public string TypeId { get; private set; } = Configuration.FolderTypes.Ordinary.ToString();

        [NotMapped]
        [EnumDataType(typeof(Configuration.FolderTypes))]
        public Configuration.FolderTypes FolderType
        {
            get => Enum.Parse<Configuration.FolderTypes>(TypeId);
            set => TypeId = value.ToString();
        }

        public FolderModel() { }

        public static Result<FolderModel> Create(string name, Guid ownerId, Guid folderId)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrEmpty(name))
            {
                return Result.Failure<FolderModel>("Invalid folder name");
            }

            if (ownerId == Guid.Empty)
            {
                return Result.Failure<FolderModel>("Invalid ownder id");
            }

            return Result.Success(new FolderModel()
            {
                Id = Guid.NewGuid(),
                Name = name,
                OwnerId = ownerId,
                CreationTime = DateTime.Now,
                FolderId = folderId
            });
        }

        public static Result<FolderModel> Create(string name, Guid ownerId, Guid folderId, Configuration.FolderTypes folderType, bool visibility)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrEmpty(name))
            {
                return Result.Failure<FolderModel>("Invalid folder name");
            }

            if (ownerId == Guid.Empty)
            {
                return Result.Failure<FolderModel>("Invalid ownder id");
            }

            return Result.Success(new FolderModel()
            {
                Id = Guid.NewGuid(),
                Name = name,
                OwnerId = ownerId,
                CreationTime = DateTime.Now,
                FolderId = folderId,
                FolderType = folderType,
                Visibility = visibility
            });
        }

        public async Task SetPreviewAsync (IPreviewService previewService, List<FileModel> preview)
        {
            foreach (var item in preview)
            {
                await item.SetPreview(previewService);
            }

            Preview = preview;
        }
    }
}