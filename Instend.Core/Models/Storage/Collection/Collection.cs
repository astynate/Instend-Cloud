using CSharpFunctionalExtensions;
using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Instend.Core.Models.Access;

namespace Instend.Core.Models.Storage.Collection
{
    [Table("collections")]
    public class Collection : AccessItemBase
    {
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("creation_time")] public DateTime CreationTime { get; private set; }
        [Column("folder_id")] public Guid FolderId { get; private set; }
        [Column("visibility")] public bool Visibility { get; private set; } = true;
        [Column("type")] public string TypeId { get; private set; } = Configuration.CollectionTypes.Ordinary.ToString();

        [NotMapped] public List<File.File> Preview { get; private set; } = new();

        //public IEnumerable<CollectionAccount> AccoutsWithAccess { get; set; } = [];

        [NotMapped]
        [EnumDataType(typeof(Configuration.CollectionTypes))]
        public Configuration.CollectionTypes Type
        {
            get => Enum.Parse<Configuration.CollectionTypes>(TypeId);
            set => TypeId = value.ToString();
        }

        public Collection() { }

        public static Result<Collection> Create(string name, Guid ownerId, Guid folderId)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrEmpty(name))
                return Result.Failure<Collection>("Invalid folder name");

            if (ownerId == Guid.Empty)
                return Result.Failure<Collection>("Invalid ownder id");

            return Result.Success(new Collection()
            {
                Id = Guid.NewGuid(),
                Name = name,
                CreationTime = DateTime.Now,
                FolderId = folderId
            });
        }

        public static Result<Collection> Create(string name, Guid folderId, Configuration.CollectionTypes folderType, bool visibility)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrEmpty(name))
                return Result.Failure<Collection>("Invalid folder name");

            return Result.Success(new Collection()
            {
                Id = Guid.NewGuid(),
                Name = name,
                CreationTime = DateTime.Now,
                FolderId = folderId,
                Type = folderType,
                Visibility = visibility
            });
        }

        public async Task SetPreviewAsync(IPreviewService previewService, List<File.File> preview)
        {
            foreach (var item in preview)
            {
                await item.SetPreview(previewService);
            }

            Preview = preview;
        }
    }
}